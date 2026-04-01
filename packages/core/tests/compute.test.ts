import { describe, expect, it } from "bun:test";
import { computeSlice, computeVisibleCount } from "../src/compute.js";

// ── computeVisibleCount ───────────────────────────────────────────────────────

describe("computeVisibleCount", () => {
    it("fits all items when there is enough space", () => {
        expect(computeVisibleCount(300, [50, 50, 50], 40, 10)).toBe(3);
    });

    it("returns 0 when even the first item plus moreEl overflows", () => {
        expect(computeVisibleCount(60, [50, 50, 50], 40, 10)).toBe(0);
    });

    it("shows all items when the last item fits without a moreEl", () => {
        // 50 + 10 + 50 = 110, no remaining items so no moreEl needed
        expect(computeVisibleCount(110, [50, 50], 40, 10)).toBe(2);
    });

    it("accounts for gap between items", () => {
        // item0=50, gap=20, item1=50, gap=20, moreEl=30 → 170 needed for 1 visible
        // available=100: item0(50) + gap(20) + moreEl(30) = 100 → fits 1
        expect(computeVisibleCount(100, [50, 50], 30, 20)).toBe(1);
    });

    it("handles a single item that fits alone", () => {
        expect(computeVisibleCount(100, [80], 40, 10)).toBe(1);
    });

    it("handles empty sizes array", () => {
        expect(computeVisibleCount(200, [], 40, 10)).toBe(0);
    });

    it("respects zero gap", () => {
        expect(computeVisibleCount(100, [30, 30, 30], 20, 0)).toBe(3);
    });
});

// ── computeSlice ──────────────────────────────────────────────────────────────

describe("computeSlice / sliceFrom=start", () => {
    const items = ["a", "b", "c", "d", "e"];

    it("shows first N items and hides the rest", () => {
        const { visibleItems, hiddenItems, startIndex, isOverflowing } =
            computeSlice(items, 3, "start");
        expect(visibleItems).toEqual(["a", "b", "c"]);
        expect(hiddenItems).toEqual(["d", "e"]);
        expect(startIndex).toBe(0);
        expect(isOverflowing).toBe(true);
    });

    it("shows all items when visibleCount >= length", () => {
        const { visibleItems, hiddenItems, isOverflowing } = computeSlice(
            items,
            10,
            "start",
        );
        expect(visibleItems).toEqual(items);
        expect(hiddenItems).toEqual([]);
        expect(isOverflowing).toBe(false);
    });

    it("shows nothing when visibleCount is 0", () => {
        const { visibleItems, hiddenItems, isOverflowing } = computeSlice(
            items,
            0,
            "start",
        );
        expect(visibleItems).toEqual([]);
        expect(hiddenItems).toEqual(items);
        expect(isOverflowing).toBe(true);
    });
});

describe("computeSlice / sliceFrom=end", () => {
    const items = ["a", "b", "c", "d", "e"];

    it("shows last N items and hides the front", () => {
        const { visibleItems, hiddenItems, startIndex, isOverflowing } =
            computeSlice(items, 3, "end");
        expect(visibleItems).toEqual(["c", "d", "e"]);
        expect(hiddenItems).toEqual(["a", "b"]);
        expect(startIndex).toBe(2);
        expect(isOverflowing).toBe(true);
    });

    it("shows all items when visibleCount >= length", () => {
        const { visibleItems, hiddenItems, startIndex, isOverflowing } =
            computeSlice(items, 10, "end");
        expect(visibleItems).toEqual(items);
        expect(hiddenItems).toEqual([]);
        expect(startIndex).toBe(0);
        expect(isOverflowing).toBe(false);
    });

    it("shows nothing when visibleCount is 0", () => {
        const { visibleItems, hiddenItems, isOverflowing } = computeSlice(
            items,
            0,
            "end",
        );
        expect(visibleItems).toEqual([]);
        expect(hiddenItems).toEqual(items);
        expect(isOverflowing).toBe(true);
    });

    it("clamps visibleCount to items.length", () => {
        // Infinity is the initial value before first measurement
        const { visibleItems, isOverflowing } = computeSlice(
            items,
            Infinity,
            "end",
        );
        expect(visibleItems).toEqual(items);
        expect(isOverflowing).toBe(false);
    });
});
