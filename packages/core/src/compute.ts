import type { Direction, SliceFrom } from "./types.js";

/**
 * Returns the inner content size of `el` along `direction`,
 * excluding padding and border.
 *
 * Pass a pre-computed `style` / `rect` to avoid redundant DOM calls when the
 * caller already has them (e.g. when calling getAvailableSize and getGap together).
 */
export function getAvailableSize(
    el: HTMLElement,
    direction: Direction,
    style?: CSSStyleDeclaration,
    rect?: DOMRect,
): number {
    const s = style ?? getComputedStyle(el);
    const r = rect ?? el.getBoundingClientRect();
    if (direction === "horizontal") {
        const pl = parseFloat(s.paddingLeft) || 0;
        const pr = parseFloat(s.paddingRight) || 0;
        const bl = parseFloat(s.borderLeftWidth) || 0;
        const br = parseFloat(s.borderRightWidth) || 0;
        return r.width - pl - pr - bl - br;
    }
    const pt = parseFloat(s.paddingTop) || 0;
    const pb = parseFloat(s.paddingBottom) || 0;
    const bt = parseFloat(s.borderTopWidth) || 0;
    const bb = parseFloat(s.borderBottomWidth) || 0;
    return r.height - pt - pb - bt - bb;
}

/**
 * Returns the gap between flex/grid children along `direction`.
 * Returns 0 for "normal" or unparseable values.
 *
 * Pass a pre-computed `style` to avoid a redundant DOM call when the caller
 * already has one (e.g. when calling getAvailableSize and getGap together).
 */
export function getGap(
    el: HTMLElement,
    direction: Direction,
    style?: CSSStyleDeclaration,
): number {
    const s = style ?? getComputedStyle(el);
    const raw = direction === "horizontal" ? s.columnGap : s.rowGap;
    if (!raw || raw === "normal") return 0;
    return parseFloat(raw) || 0;
}

/**
 * Given a list of item sizes, returns how many items fit within `availableSize`.
 * When items overflow, a "more" element of `moreSize` is reserved at the end.
 * All units are pixels.
 */
export function computeVisibleCount(
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

/**
 * Derives visible/hidden slices from `items` given a `visibleCount`.
 * When `sliceFrom="end"`, items are shown from the end of the array,
 * hiding items at the beginning.
 */
export function computeSlice<T>(
    items: T[],
    visibleCount: number,
    sliceFrom: SliceFrom,
): { visibleItems: T[]; hiddenItems: T[]; startIndex: number; isOverflowing: boolean } {
    const clamped = Math.min(visibleCount, items.length);
    const startIndex =
        sliceFrom === "end" ? Math.max(0, items.length - clamped) : 0;
    const visibleItems =
        sliceFrom === "start"
            ? items.slice(0, clamped)
            : items.slice(startIndex);
    const hiddenItems =
        sliceFrom === "start"
            ? items.slice(clamped)
            : items.slice(0, startIndex);
    return {
        visibleItems,
        hiddenItems,
        startIndex,
        isOverflowing: visibleCount < items.length,
    };
}
