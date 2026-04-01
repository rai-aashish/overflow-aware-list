# @overflow-aware-list/svelte

Measures which items physically fit in a container, renders those, and hands you the rest — so you can collapse overflow into a `+N` badge, a dropdown menu of hidden actions, a popover, an ellipsis, or anything your UI needs.

**[Live demo](https://rai-aashish.github.io/overflow-aware-list/svelte)**

```bash
npm install @overflow-aware-list/svelte
```

Peer dependency: `svelte >= 5`

---

## Quick start

```svelte
<script>
  import { OverflowList } from "@overflow-aware-list/svelte";

  type Action = { label: string; onclick: () => void };
  let { actions }: { actions: Action[] } = $props();

  let open = $state(false);
</script>

<OverflowList renderAs="nav" items={actions} class="gap-1">
  {#snippet renderItem(action)}
    <button onclick={action.onclick}>{action.label}</button>
  {/snippet}
  {#snippet renderMore(hidden)}
    <div style="position: relative">
      <button onclick={() => (open = !open)}>+{hidden.length} more</button>
      {#if open}
        <ul style="position: absolute; top: 100%; right: 0">
          {#each hidden as action}
            <li><button onclick={action.onclick}>{action.label}</button></li>
          {/each}
        </ul>
      {/if}
    </div>
  {/snippet}
</OverflowList>
```

---

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | — | Array of items to display. |
| `renderItem` | `Snippet<[item: T, index: number]>` | — | Renders a single visible item. `index` is the item's original position in `items`. |
| `renderMore` | `Snippet<[hidden: T[]]>` | — | Renders the overflow indicator. Receives the array of hidden items. Also rendered off-screen with `[]` so its size is always measured. |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout axis. |
| `sliceFrom` | `"start" \| "end"` | `"start"` | Which end to keep visible. `"start"` keeps the first N items (badge at end). `"end"` keeps the last N items (badge at start — useful for breadcrumbs). |
| `renderAs` | `keyof HTMLElementTagNameMap` | `"div"` | HTML tag for the container element. Generic — rest props and `ref` narrow to match the chosen tag. |
| `ref` | `HTMLElementTagNameMap[Tag] \| null` | — | Bindable ref to the container element. |
| `class` | `string` | — | CSS class forwarded to the container. Applied to the measurement layer too, so gap and font styles are accounted for in size calculations. |
| `style` | `string` | — | Inline style forwarded to the container. Also applied to the measurement layer. |

All other props are spread onto the container element and are typed to match `renderAs`.

### Forced container styles

The following styles are always applied to the container via `style:` directives and cannot be overridden:

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `start` |
| `justify-content` | `start` |
| `overflow` | `hidden` |
| `flex-direction` | `row` (horizontal) or `column` (vertical) |
| `width` | `100%` (horizontal only) |
| `height` | `100%` (vertical only) |

Set `gap` via `class` or `style` — the controller reads it from computed styles and accounts for it in fit calculations.

---

## Examples

### Breadcrumb (sliceFrom="end")

```svelte
<OverflowList items={crumbs} sliceFrom="end">
  {#snippet renderItem(crumb, i)}
    <span>
      {#if i > 0}<span>/</span>{/if}
      {crumb}
    </span>
  {/snippet}
  {#snippet renderMore(hidden)}
    <span>/…{hidden.length}/</span>
  {/snippet}
</OverflowList>
```

### Vertical feed with fixed height

```svelte
<div style="height: 200px">
  <OverflowList items={notifications} direction="vertical" class="gap-2">
    {#snippet renderItem(n)}
      <div>{n.text}</div>
    {/snippet}
    {#snippet renderMore(hidden)}
      <div>+{hidden.length} more</div>
    {/snippet}
  </OverflowList>
</div>
```

### Semantic container with bindable ref

```svelte
<script>
  let navEl = $state(null);
</script>

<OverflowList renderAs="nav" bind:ref={navEl} items={links}>
  {#snippet renderItem(link)}
    <a href={link.href}>{link.label}</a>
  {/snippet}
  {#snippet renderMore(hidden)}
    <span>+{hidden.length}</span>
  {/snippet}
</OverflowList>
```

---

## How it works

1. All items render invisibly off-screen at natural size. A `ResizeObserver` tracks each one.
2. Available container size minus the `renderMore` snippet size = how many items fit.
3. On any size change the controller recomputes the visible slice and updates reactive state.
4. SSR renders all items; the client trims after the first `ResizeObserver` callback.

---

## License

MIT © Aashish Rai
