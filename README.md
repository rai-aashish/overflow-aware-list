# overflow-aware-list

A component that automatically measures its container and hides items that don't fit, passing the hidden items to a custom overflow indicator. Works with React and Svelte 5.

**Live demos:** [React](https://rai-aashish.github.io/overflow-aware-list/react/) · [Svelte](https://rai-aashish.github.io/overflow-aware-list/svelte)

## Packages

| Package | npm |
|---|---|
| `@overflow-aware-list/core` | Framework-agnostic controller |
| `@overflow-aware-list/react` | React component |
| `@overflow-aware-list/svelte` | Svelte 5 component |

## How it works

All items are rendered off-screen first to measure their sizes. The controller then calculates how many fit inside the container (accounting for gap, padding, and the overflow indicator's own size) and updates state. A `ResizeObserver` watches the container and each item so the count stays accurate when the layout changes.

## Installation

```bash
# React
npm install @overflow-aware-list/react

# Svelte
npm install @overflow-aware-list/svelte
```

## Usage

### React

```tsx
import { OverflowList } from "@overflow-aware-list/react";

const tags = ["Design", "Engineering", "Product", "Marketing", "Sales"];

<OverflowList
  items={tags}
  renderItem={(tag, i) => <span key={i}>{tag}</span>}
  renderMore={(hidden) => <span>+{hidden.length} more</span>}
/>
```

### Svelte 5

```svelte
<script lang="ts">
  import { OverflowList } from "@overflow-aware-list/svelte";
  const tags = ["Design", "Engineering", "Product", "Marketing", "Sales"];
</script>

<OverflowList items={tags}>
  {#snippet renderItem(tag, i)}
    <span>{tag}</span>
  {/snippet}
  {#snippet renderMore(hidden)}
    <span>+{hidden.length} more</span>
  {/snippet}
</OverflowList>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `T[]` | — | Array of items to display |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout axis |
| `sliceFrom` | `"start" \| "end"` | `"start"` | Keep the start visible (overflow at end) or keep the end visible (overflow at start) |
| `renderItem` | `(item: T, index: number) => ReactNode` | — | Renders a single visible item |
| `renderMore` | `(hidden: T[]) => ReactNode` | — | Renders the overflow indicator; receives the hidden items |
| `renderAs` | `keyof JSX.IntrinsicElements` | `"div"` | HTML tag for the container element |

React only: additional HTML attributes for the container element are forwarded via rest props. The component also accepts a `ref` that resolves to the container element.

## `sliceFrom` behavior

- `"start"` — shows the first N items; the overflow indicator appears at the end.
- `"end"` — shows the last N items; the overflow indicator appears at the start.

## Framework-agnostic core

If you need to integrate with another framework, use `@overflow-aware-list/core` directly:

```ts
import { OverflowListController } from "@overflow-aware-list/core";

const controller = new OverflowListController({
  items,
  direction: "horizontal",
  sliceFrom: "start",
  onStateChange(state) {
    // state.visibleItems, state.hiddenItems, state.isOverflowing, state.measured
  },
});

controller.mountContainer(containerEl);
controller.registerItemElement(0, itemEl);
controller.registerMoreElement(moreEl);

// Update options when props change
controller.updateOptions({ items: newItems });

// Clean up
controller.destroy();
```

## License

MIT
