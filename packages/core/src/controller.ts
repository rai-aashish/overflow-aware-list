import {
    computeSlice,
    computeVisibleCount,
    getAvailableSize,
    getGap,
} from "./compute.js";
import type {
    Direction,
    OverflowListOptions,
    OverflowListState,
    SliceFrom,
} from "./types.js";

export class OverflowListController<T> {
    private containerEl: HTMLElement | null = null;
    private itemEls = new Map<number, HTMLElement>();
    private moreEl: HTMLElement | null = null;

    private containerObserver: ResizeObserver | null = null;
    private itemObservers = new Map<number, ResizeObserver>();
    private moreObserver: ResizeObserver | null = null;
    private rafId: number | null = null;
    private lastVisibleCount: number | null = null;

    private items: T[];
    private direction: Direction;
    private sliceFrom: SliceFrom;
    private onStateChange: (state: OverflowListState<T>) => void;

    constructor(options: OverflowListOptions<T>) {
        this.items = options.items;
        this.direction = options.direction ?? "horizontal";
        this.sliceFrom = options.sliceFrom ?? "start";
        this.onStateChange = options.onStateChange;
    }

    // ── Element registration ──────────────────────────────────────────────

    /**
     * Register the scroll/clip container element. Starts observing it for
     * size changes. Call with `null` to unregister.
     */
    mountContainer(el: HTMLElement | null): void {
        if (this.containerEl === el) return;
        this.containerObserver?.disconnect();
        this.containerObserver = null;
        this.containerEl = el;
        if (el && typeof ResizeObserver !== "undefined") {
            this.containerObserver = new ResizeObserver(() =>
                this.scheduleRecompute(),
            );
            this.containerObserver.observe(el);
        }
    }

    /**
     * Register an off-screen measurement element for item at `index`.
     * Call with `null` to unregister.
     */
    registerItemElement(index: number, el: HTMLElement | null): void {
        if (this.itemEls.get(index) === el) return;
        this.itemObservers.get(index)?.disconnect();
        this.itemObservers.delete(index);

        if (el) {
            this.itemEls.set(index, el);
            if (typeof ResizeObserver !== "undefined") {
                const ro = new ResizeObserver(() => this.scheduleRecompute());
                ro.observe(el);
                this.itemObservers.set(index, ro);
            }
        } else {
            this.itemEls.delete(index);
        }
    }

    /**
     * Register the off-screen measurement element for the "more" indicator.
     * Call with `null` to unregister.
     */
    registerMoreElement(el: HTMLElement | null): void {
        if (this.moreEl === el) return;
        this.moreObserver?.disconnect();
        this.moreObserver = null;
        this.moreEl = el;
        if (el) {
            if (typeof ResizeObserver !== "undefined") {
                this.moreObserver = new ResizeObserver(() =>
                    this.scheduleRecompute(),
                );
                this.moreObserver.observe(el);
            }
            this.scheduleRecompute();
        }
    }

    // ── Options ───────────────────────────────────────────────────────────

    /** Update items/direction/sliceFrom and trigger a recompute. */
    updateOptions(
        partial: Partial<
            Pick<OverflowListOptions<T>, "items" | "direction" | "sliceFrom">
        >,
    ): void {
        let dirty = false;
        if (partial.items !== undefined && partial.items !== this.items) {
            this.items = partial.items;
            this.lastVisibleCount = null;
            dirty = true;
        }
        if (
            partial.direction !== undefined &&
            partial.direction !== this.direction
        ) {
            this.direction = partial.direction;
            dirty = true;
        }
        if (
            partial.sliceFrom !== undefined &&
            partial.sliceFrom !== this.sliceFrom
        ) {
            this.sliceFrom = partial.sliceFrom;
            this.lastVisibleCount = null;
            dirty = true;
        }
        if (dirty) this.scheduleRecompute();
    }

    // ── Recomputation ─────────────────────────────────────────────────────

    /** Force an immediate (synchronous) recompute. Prefer scheduleRecompute for most cases. */
    recompute(): void {
        if (!this.containerEl) return;

        // Single getComputedStyle + getBoundingClientRect call shared by both helpers.
        const style = getComputedStyle(this.containerEl);
        const rect = this.containerEl.getBoundingClientRect();
        const availableSize = getAvailableSize(this.containerEl, this.direction, style, rect);
        const gap = getGap(this.containerEl, this.direction, style);

        // Hoist direction check so it isn't re-evaluated for every item.
        const isHorizontal = this.direction === "horizontal";

        const sizes = this.items.map((_, i) => {
            const el = this.itemEls.get(i);
            if (!el) return 0;
            const r = el.getBoundingClientRect();
            return Math.ceil(isHorizontal ? r.width : r.height);
        });

        const moreRect = this.moreEl?.getBoundingClientRect();
        const moreSize = moreRect
            ? Math.ceil(isHorizontal ? moreRect.width : moreRect.height)
            : 0;

        const visibleCount = computeVisibleCount(
            availableSize,
            sizes,
            moreSize,
            gap,
        );

        // Skip re-render when the visible/hidden split hasn't changed.
        if (visibleCount === this.lastVisibleCount) return;
        this.lastVisibleCount = visibleCount;

        const slice = computeSlice(this.items, visibleCount, this.sliceFrom);
        this.onStateChange({ ...slice, measured: true });
    }

    private scheduleRecompute(): void {
        if (this.rafId !== null) return;
        if (typeof requestAnimationFrame !== "undefined") {
            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;
                this.recompute();
            });
        } else {
            // SSR / non-browser fallback
            this.recompute();
        }
    }

    // ── Cleanup ───────────────────────────────────────────────────────────

    /** Disconnect all observers and cancel any pending RAF. Safe to call multiple times. */
    destroy(): void {
        this.containerObserver?.disconnect();
        this.containerObserver = null;
        this.itemObservers.forEach((ro) => ro.disconnect());
        this.itemObservers.clear();
        this.moreObserver?.disconnect();
        this.moreObserver = null;
        if (this.rafId !== null && typeof cancelAnimationFrame !== "undefined") {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.containerEl = null;
        this.itemEls.clear();
        this.moreEl = null;
    }
}
