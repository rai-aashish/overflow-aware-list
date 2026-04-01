<script lang="ts" module>
    import { cn } from "$lib/utils.js";
    import type { Snippet } from "svelte";

    export type OverflowListProps<T> = {
        items: T[];
        direction?: "horizontal" | "vertical";
        sliceFrom?: "start" | "end";
        renderItem: Snippet<[T, number]>;
        renderMore: Snippet<[T[]]>;
        renderAs?: string;
        itemTag?: string;
        class?: string;
        ref?: HTMLElement | null;
    };
</script>

<script lang="ts" generics="T">
    let {
        items,
        direction = "horizontal",
        sliceFrom = "start",
        renderItem,
        renderMore,
        renderAs = "div",
        itemTag = "div",
        class: className,
        ref = $bindable(null),
    }: OverflowListProps<T> = $props();

    let itemEls = $state<(HTMLElement | null)[]>([]);
    let moreEl = $state<HTMLElement | null>(null);
    let visibleCount = $state(Infinity);
    let measured = $state(false);

    // Index into `items` where the visible slice begins
    let startIndex = $derived(
        sliceFrom === "end"
            ? Math.max(0, items.length - Math.min(visibleCount, items.length))
            : 0,
    );
    let visibleItems = $derived(
        sliceFrom === "start"
            ? items.slice(0, visibleCount)
            : items.slice(startIndex),
    );
    let hiddenItems = $derived(
        sliceFrom === "start"
            ? items.slice(visibleCount)
            : items.slice(0, startIndex),
    );
    let isOverflowing = $derived(visibleCount < items.length);

    function getAvailableSize(): number {
        if (!ref) return 0;
        const style = getComputedStyle(ref);
        const rect = ref.getBoundingClientRect();
        if (direction === "horizontal") {
            const pl = parseFloat(style.paddingLeft) || 0;
            const pr = parseFloat(style.paddingRight) || 0;
            const bl = parseFloat(style.borderLeftWidth) || 0;
            const br = parseFloat(style.borderRightWidth) || 0;
            return rect.width - pl - pr - bl - br;
        }
        const pt = parseFloat(style.paddingTop) || 0;
        const pb = parseFloat(style.paddingBottom) || 0;
        const bt = parseFloat(style.borderTopWidth) || 0;
        const bb = parseFloat(style.borderBottomWidth) || 0;
        return rect.height - pt - pb - bt - bb;
    }

    function getGap(): number {
        if (!ref) return 0;
        const style = getComputedStyle(ref);
        const raw = direction === "horizontal" ? style.columnGap : style.rowGap;
        if (!raw || raw === "normal") return 0;
        return parseFloat(raw) || 0;
    }

    function computeVisibleCount(
        availableSize: number,
        sizes: number[],
        moreSize: number,
        gap: number,
    ): number {
        let used = 0;
        for (let i = 0; i < sizes.length; i++) {
            const spaceNeeded = used + (i > 0 ? gap : 0) + sizes[i];
            const remaining = sizes.length - (i + 1);
            const totalNeeded =
                remaining > 0 ? spaceNeeded + gap + moreSize : spaceNeeded;
            if (totalNeeded > availableSize) return i;
            used = spaceNeeded;
        }
        return sizes.length;
    }

    function recompute() {
        if (!ref) return;
        const availableSize = getAvailableSize();
        const gap = getGap();
        const sizes = items.map((_, i) => {
            const el = itemEls[i];
            if (!el) return 0;
            const rect = el.getBoundingClientRect();
            return Math.ceil(
                direction === "horizontal" ? rect.width : rect.height,
            );
        });
        const moreRect = moreEl?.getBoundingClientRect();
        const moreSize = moreRect
            ? Math.ceil(
                  direction === "horizontal" ? moreRect.width : moreRect.height,
              )
            : 0;
        visibleCount = computeVisibleCount(availableSize, sizes, moreSize, gap);
        measured = true;
    }

    // Observe container for size changes
    $effect(() => {
        const el = ref;
        if (!el || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(() => requestAnimationFrame(recompute));
        ro.observe(el);
        return () => ro.disconnect();
    });

    // Observe each measured item for content-driven size changes
    $effect(() => {
        const els = itemEls.filter((el): el is HTMLElement => el !== null);
        if (typeof ResizeObserver === "undefined") return;
        const observers = els.map((el) => {
            const ro = new ResizeObserver(() =>
                requestAnimationFrame(recompute),
            );
            ro.observe(el);
            return ro;
        });
        return () => observers.forEach((ro) => ro.disconnect());
    });

    // Trigger recompute when moreEl mounts so its size is included
    $effect(() => {
        if (moreEl) requestAnimationFrame(recompute);
    });
</script>

<!-- Display container: hidden until first measurement to prevent flash of full list -->
<svelte:element
    this={renderAs}
    bind:this={ref}
    data-slot="overflow-list"
    class={cn(
        "flex items-start justify-start overflow-hidden",
        direction === "horizontal" ? "w-full flex-row" : "h-full flex-col",
        className,
    )}
    style:visibility={measured ? "visible" : "hidden"}
>
    {#if isOverflowing && sliceFrom === "end"}
        {@render renderMore(hiddenItems)}
    {/if}
    {#each visibleItems as item, i (startIndex + i)}
        <svelte:element this={itemTag} data-overflow-item class="shrink-0">
            {@render renderItem(item, startIndex + i)}
        </svelte:element>
    {/each}
    {#if isOverflowing && sliceFrom === "start"}
        {@render renderMore(hiddenItems)}
    {/if}
</svelte:element>

<!-- Off-screen measurement layer: always renders all items + moreEl to measure sizes -->
<div
    aria-hidden="true"
    inert
    style:position="absolute"
    style:visibility="hidden"
    style:pointer-events="none"
    style:left="-9999px"
    style:top="0"
    style:display="flex"
    style:flex-wrap="nowrap"
    style:flex-direction={direction === "horizontal" ? "row" : "column"}
>
    {#each items as item, i (i)}
        <div bind:this={itemEls[i]} class="shrink-0">
            {@render renderItem(item, i)}
        </div>
    {/each}
    <div bind:this={moreEl}>
        {@render renderMore([])}
    </div>
</div>
