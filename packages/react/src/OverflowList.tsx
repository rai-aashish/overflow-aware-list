import React, { useEffect, useRef, useState, useCallback, forwardRef } from "react";
import type { ReactNode, CSSProperties, Ref, RefCallback, MutableRefObject } from "react";
import { OverflowListController } from "@overflow-aware-list/core";
import type { Direction, SliceFrom, OverflowListState } from "@overflow-aware-list/core";

// Merges multiple refs (callback refs, ref objects, or null/undefined) into one
// stable RefCallback. Reads the latest refs on every call via a ref so the
// returned callback itself never needs to change identity.
function useMergeRefs<T>(...refs: (Ref<T> | null | undefined)[]): RefCallback<T> {
    const refsRef = useRef(refs);
    refsRef.current = refs;
    return useCallback((node: T | null) => {
        for (const ref of refsRef.current) {
            if (!ref) continue;
            if (typeof ref === "function") {
                ref(node);
            } else {
                (ref as MutableRefObject<T | null>).current = node;
            }
        }
    }, []); // stable — reads latest via refsRef
}

export type OverflowListProps<T, As extends keyof React.JSX.IntrinsicElements = "div"> = Omit<
    React.ComponentPropsWithoutRef<As>,
    "children"
> & {
    /** Array of items to display. */
    items: T[];
    /** Layout axis. Default: "horizontal". */
    direction?: Direction;
    /**
     * Which end to keep visible when overflow occurs.
     * "start" — show first N items, overflow indicator at end (default).
     * "end"   — show last N items, overflow indicator at start.
     */
    sliceFrom?: SliceFrom;
    /** Render a single visible item. Receives the item and its original index. */
    renderItem: (item: T, index: number) => ReactNode;
    /**
     * Render the overflow indicator. Receives the array of hidden items.
     * Also rendered (with an empty array) in the off-screen layer so its size
     * is always accounted for.
     */
    renderMore: (hidden: T[]) => ReactNode;
    /**
     * HTML tag for the outer container element. Default: "div".
     * Generic — rest props and ref narrow to match the chosen tag.
     * @example renderAs="nav"     // ref: HTMLElement, restProps: nav attrs
     * @example renderAs="button"  // ref: HTMLButtonElement, restProps: button+button attrs
     */
    renderAs?: As;
};

// forwardRef with a generic signature requires a cast to preserve the generics
// at the call site. The inner implementation is fully typed; only the JSX
// element creation uses a cast to React.ElementType (unavoidable for dynamic tags).
const OverflowListInner = forwardRef(function OverflowList<
    T,
    As extends keyof React.JSX.IntrinsicElements = "div",
>(
    {
        items,
        direction = "horizontal",
        sliceFrom = "start",
        renderItem,
        renderMore,
        renderAs,
        className,
        style,
        ...restProps
    }: OverflowListProps<T, As>,
    forwardedRef: Ref<React.ElementRef<As>>,
) {
    // Initialize with all items so SSR renders full list; client trims after measuring.
    const [listState, setListState] = useState<OverflowListState<T>>(() => ({
        visibleItems: items,
        hiddenItems: [],
        isOverflowing: false,
        startIndex: 0,
        measured: false,
    }));

    const controllerRef = useRef<OverflowListController<T> | null>(null);

    // Store DOM elements so they can be registered once the controller is created,
    // since ref callbacks fire (during commit) before useEffect runs.
    const containerElRef = useRef<HTMLElement | null>(null);
    const moreElRef = useRef<HTMLElement | null>(null);
    const itemElsRef = useRef(new Map<number, HTMLElement | null>());
    const itemRefCallbacks = useRef(new Map<number, (el: HTMLElement | null) => void>());

    // Create controller once; wire up any elements already mounted
    useEffect(() => {
        const controller = new OverflowListController<T>({
            items,
            direction,
            sliceFrom,
            onStateChange: setListState,
        });
        controllerRef.current = controller;

        if (containerElRef.current) controller.mountContainer(containerElRef.current);
        itemElsRef.current.forEach((el, i) => { if (el) controller.registerItemElement(i, el); });
        if (moreElRef.current) controller.registerMoreElement(moreElRef.current);

        return () => controller.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep controller in sync with prop changes
    useEffect(() => {
        controllerRef.current?.updateOptions({ items, direction, sliceFrom });
    }, [items, direction, sliceFrom]);

    const internalContainerRef = useCallback((el: HTMLElement | null) => {
        containerElRef.current = el;
        controllerRef.current?.mountContainer(el);
    }, []);

    // Merge the internal controller ref with the consumer's forwarded ref
    const mergedContainerRef = useMergeRefs<React.ElementRef<As>>(
        forwardedRef,
        internalContainerRef as Ref<React.ElementRef<As>>,
    );

    const moreRef = useCallback((el: HTMLElement | null) => {
        moreElRef.current = el;
        controllerRef.current?.registerMoreElement(el);
    }, []);

    function getItemRef(i: number) {
        if (!itemRefCallbacks.current.has(i)) {
            itemRefCallbacks.current.set(i, (el: HTMLElement | null) => {
                itemElsRef.current.set(i, el);
                controllerRef.current?.registerItemElement(i, el);
            });
        }
        return itemRefCallbacks.current.get(i)!;
    }

    const { visibleItems, hiddenItems, isOverflowing, startIndex } = listState;

    // User style is applied first; our layout-critical properties always win.
    const containerStyle: CSSProperties = {
        ...(style as CSSProperties),
        display: "flex",
        alignItems: "start",
        justifyContent: "start",
        overflow: "hidden",
        flexDirection: direction === "horizontal" ? "row" : "column",
        width: direction === "horizontal" ? "100%" : undefined,
        height: direction === "vertical" ? "100%" : undefined,
    };

    // Cast needed for JSX dynamic tag; type safety is enforced at the props level.
    const Tag = (renderAs ?? "div") as React.ElementType;

    return (
        <>
            {/* Visible container — SSR renders all items; client trims to what fits */}
            <Tag
                {...restProps}
                ref={mergedContainerRef}
                className={className}
                data-slot="overflow-list"
                style={containerStyle}
            >
                {isOverflowing && sliceFrom === "end" && renderMore(hiddenItems)}
                {visibleItems.map((item, i) => (
                    <div key={startIndex + i} data-overflow-item style={{ flexShrink: 0 }}>
                        {renderItem(item, startIndex + i)}
                    </div>
                ))}
                {isOverflowing && sliceFrom === "start" && renderMore(hiddenItems)}
            </Tag>

            {/* Off-screen measurement layer — mirrors className/style from the container so
                 item sizes are measured in the same CSS context (fonts, gap, padding, etc.) */}
            <div
                aria-hidden="true"
                inert
                className={className}
                style={{
                    ...(style as CSSProperties),
                    position: "absolute",
                    visibility: "hidden",
                    pointerEvents: "none",
                    left: "-9999px",
                    top: "0",
                    display: "flex",
                    flexWrap: "nowrap",
                    flexDirection: direction === "horizontal" ? "row" : "column",
                }}
            >
                {items.map((item, i) => (
                    <div key={i} ref={getItemRef(i)} style={{ flexShrink: 0 }}>
                        {renderItem(item, i)}
                    </div>
                ))}
                <div ref={moreRef}>{renderMore([])}</div>
            </div>
        </>
    );
});

export const OverflowList = OverflowListInner as <
    T,
    As extends keyof React.JSX.IntrinsicElements = "div",
>(
    props: OverflowListProps<T, As> & { ref?: Ref<React.ElementRef<As>> },
) => React.ReactElement;
