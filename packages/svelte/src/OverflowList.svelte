<script lang="ts" module>
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import type { Direction, OverflowListState, SliceFrom } from "@overflow-aware-list/core";

    export type OverflowListProps<T, Tag extends keyof HTMLElementTagNameMap = "div"> = Omit<
        HTMLAttributes<HTMLElementTagNameMap[Tag]>,
        "class"
    > & {
        items: T[];
        direction?: Direction;
        keepFrom?: SliceFrom;
        renderItem: Snippet<[T, number]>;
        renderOverflow: Snippet<[T[]]>;
        /** HTML tag for the outer container element. Default: "div". */
        as?: Tag;
        /** HTML tag for each item wrapper element. Default: "div". */
        itemTag?: string;
        class?: string;
        ref?: HTMLElementTagNameMap[Tag] | null;
    };
</script>

<script lang="ts" generics="T, Tag extends keyof HTMLElementTagNameMap = 'div'">
    import { untrack } from "svelte";
    import { OverflowListController } from "@overflow-aware-list/core";

    let {
        items,
        direction = "horizontal",
        keepFrom = "start",
        renderItem,
        renderOverflow,
        as = "div" as Tag,
        itemTag = "div",
        class: className,
        ref = $bindable(null),
        ...restProps
    }: OverflowListProps<T, Tag> = $props();

    // Renamed from `state` to avoid collision with the $state rune.
    // Initialize with all items so SSR renders the full list; client trims after measuring.
    // untrack: items is a prop and reactive, but we only want the initial value here;
    // the controller keeps listState in sync via onStateChange.
    let listState: OverflowListState<T> = $state(untrack(() => ({
        visibleItems: items as T[],
        hiddenItems: [] as T[],
        isOverflowing: false,
        startIndex: 0,
        measured: false,
    })));

    // untrack: constructor intentionally captures initial prop values only;
    // $effect below keeps the controller in sync with subsequent changes.
    const controller = untrack(
        () =>
            new OverflowListController<T>({
                items,
                direction,
                sliceFrom: keepFrom,
                onStateChange: (next) => {
                    listState = next;
                },
            }),
    );

    // Keep controller in sync with prop changes
    $effect(() => {
        controller.updateOptions({ items, direction, sliceFrom: keepFrom });
    });

    // Wire container element
    $effect(() => {
        controller.mountContainer(ref);
        return () => controller.mountContainer(null);
    });

    // Cleanup on unmount
    $effect(() => {
        return () => controller.destroy();
    });

    // Measurement item element refs (off-screen layer)
    let itemEls: (HTMLElement | null)[] = $state([]);
    let moreEl: HTMLElement | null = $state(null);

    $effect(() => {
        itemEls.forEach((el, i) => controller.registerItemElement(i, el));
    });

    $effect(() => {
        controller.registerMoreElement(moreEl);
    });
</script>

<!-- Visible container: SSR renders all items; client trims to what fits -->
<!-- restProps spread first so our layout-critical style: directives always win -->
<svelte:element
    this={as}
    bind:this={ref}
    {...(restProps as any)}
    data-slot="overflow-list"
    class={className}
    style:display="flex"
    style:align-items="start"
    style:justify-content="start"
    style:overflow="hidden"
    style:flex-direction={direction === "horizontal" ? "row" : "column"}
    style:width={direction === "horizontal" ? "100%" : undefined}
    style:height={direction === "vertical" ? "100%" : undefined}
>
    {#if listState.isOverflowing && keepFrom === "end"}
        {@render renderOverflow(listState.hiddenItems)}
    {/if}
    {#each listState.visibleItems as item, i (listState.startIndex + i)}
        <svelte:element this={itemTag} data-overflow-item style:flex-shrink="0">
            {@render renderItem(item, listState.startIndex + i)}
        </svelte:element>
    {/each}
    {#if listState.isOverflowing && keepFrom === "start"}
        {@render renderOverflow(listState.hiddenItems)}
    {/if}
</svelte:element>

<!-- Off-screen measurement layer: mirrors class/style from the container so
     item sizes are measured in the same CSS context (fonts, gap, padding, etc.) -->
<div
    aria-hidden="true"
    inert
    class={className}
    style={restProps.style}
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
        <div bind:this={itemEls[i]} style:flex-shrink="0">
            {@render renderItem(item, i)}
        </div>
    {/each}
    <div bind:this={moreEl}>
        {@render renderOverflow([])}
    </div>
</div>
