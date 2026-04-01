# @overflow-aware-list/core

Framework-agnostic controller that measures which items physically fit in a container and calls your callback whenever the visible/hidden split changes. Used internally by `@overflow-aware-list/react` and `@overflow-aware-list/svelte` — use this directly to build a wrapper for any other framework.

**Live demos:** [React](https://rai-aashish.github.io/overflow-aware-list/react/) · [Svelte](https://rai-aashish.github.io/overflow-aware-list/svelte)

```bash
npm install @overflow-aware-list/core
```

---

## Usage

```ts
import { OverflowListController } from "@overflow-aware-list/core";

const controller = new OverflowListController({
  items: ["a", "b", "c", "d", "e"],
  direction: "horizontal",  // optional, default: "horizontal"
  sliceFrom: "start",       // optional, default: "start"
  onStateChange(state) {
    // called every time the visible/hidden split changes
    console.log(state.visibleItems, state.hiddenItems);
  },
});

// Register the visible container element
controller.mountContainer(containerEl);

// Register off-screen measurement elements — one per item
controller.registerItemElement(0, itemEl0);
controller.registerItemElement(1, itemEl1);

// Register the off-screen measurement element for the overflow indicator
controller.registerMoreElement(moreEl);

// Update options when props change
controller.updateOptions({ items: newItems });

// Clean up when the component unmounts
controller.destroy();
```

---

## API

### `new OverflowListController(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `items` | `T[]` | — | Array of items to track. |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout axis used to measure available space and item sizes. |
| `sliceFrom` | `"start" \| "end"` | `"start"` | `"start"` keeps the first N items visible (overflow indicator at end). `"end"` keeps the last N items visible (overflow indicator at start). |
| `onStateChange` | `(state: OverflowListState<T>) => void` | — | Called synchronously after every recompute with the new state. |

### Methods

#### `mountContainer(el: HTMLElement | null): void`
Register the container element. The controller observes it with a `ResizeObserver` and recomputes on every size change. Pass `null` to unregister.

#### `registerItemElement(index: number, el: HTMLElement | null): void`
Register an off-screen measurement element for the item at `index`. Each element is individually observed so content-driven size changes (e.g. dynamic text) trigger a recompute. Pass `null` to unregister.

#### `registerMoreElement(el: HTMLElement | null): void`
Register the off-screen measurement element for the overflow indicator. Its size is reserved in the fit calculation whenever at least one item is hidden. Pass `null` to unregister.

#### `updateOptions(partial): void`
Update `items`, `direction`, and/or `sliceFrom` after construction. Only triggers a recompute if a value actually changed.

#### `recompute(): void`
Force an immediate synchronous recompute. The controller calls this automatically via `requestAnimationFrame` on any observed size change — only call this manually if you need synchronous results.

#### `destroy(): void`
Disconnect all `ResizeObserver`s and cancel any pending animation frame. Safe to call multiple times.

---

## `OverflowListState<T>`

The object passed to `onStateChange` on every recompute.

| Field | Type | Description |
|---|---|---|
| `visibleItems` | `T[]` | Items that fit in the container. |
| `hiddenItems` | `T[]` | Items that didn't fit. |
| `isOverflowing` | `boolean` | `true` when at least one item is hidden. |
| `startIndex` | `number` | Index in `items` where the visible slice begins. Always `0` when `sliceFrom="start"`. |
| `measured` | `boolean` | `false` until the first measurement completes. Use to hide UI until the layout is stable. |

---

## License

MIT © Aashish Rai
