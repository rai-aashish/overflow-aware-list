# @overflow-aware-list/react

Measures which items physically fit in a container, renders those, and hands you the rest — so you can collapse overflow into a `+N` badge, a dropdown menu of hidden actions, a popover, an ellipsis, or anything your UI needs.

**[Live demo](https://rai-aashish.github.io/overflow-aware-list/react/)**

```bash
npm install @overflow-aware-list/react
```

Peer dependency: `react >= 18`

---

## Quick start

```tsx
import { useState } from "react";
import { OverflowList } from "@overflow-aware-list/react";

type Action = { label: string; onClick: () => void };

function Toolbar({ actions }: { actions: Action[] }) {
  const [open, setOpen] = useState(false);

  return (
    <OverflowList
      renderAs="nav"
      items={actions}
      className="gap-1"
      renderItem={(action, i) => (
        <button key={i} onClick={action.onClick}>
          {action.label}
        </button>
      )}
      renderMore={(hidden) => (
        <div style={{ position: "relative" }}>
          <button onClick={() => setOpen(o => !o)}>
            +{hidden.length} more
          </button>
          {open && (
            <ul style={{ position: "absolute", top: "100%", right: 0 }}>
              {hidden.map((action, i) => (
                <li key={i}>
                  <button onClick={action.onClick}>{action.label}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    />
  );
}
```

---

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | — | Array of items to display. |
| `renderItem` | `(item: T, index: number) => ReactNode` | — | Renders a single visible item. `index` is the item's original position in `items`. |
| `renderMore` | `(hidden: T[]) => ReactNode` | — | Renders the overflow indicator. Receives the array of hidden items. Also rendered off-screen with `[]` so its size is always measured. |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout axis. |
| `sliceFrom` | `"start" \| "end"` | `"start"` | Which end to keep visible. `"start"` keeps the first N items (badge at end). `"end"` keeps the last N items (badge at start — useful for breadcrumbs). |
| `renderAs` | `keyof JSX.IntrinsicElements` | `"div"` | HTML tag for the container element. Generic — rest props and `ref` narrow to match the chosen tag. |
| `ref` | `Ref<HTMLElementTagNameMap[As]>` | — | Forwarded ref to the container element. Merged with the internal controller ref. |
| `className` | `string` | — | CSS class forwarded to the container. Applied to the measurement layer too, so gap and font styles are accounted for in size calculations. |
| `style` | `CSSProperties` | — | Inline style forwarded to the container. Also applied to the measurement layer. |

All other props are spread onto the container element and are typed to match `renderAs`.

### Forced container styles

The following styles are always applied to the container and cannot be overridden:

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `alignItems` | `start` |
| `justifyContent` | `start` |
| `overflow` | `hidden` |
| `flexDirection` | `row` (horizontal) or `column` (vertical) |
| `width` | `100%` (horizontal only) |
| `height` | `100%` (vertical only) |

Set `gap` via `className` or `style` — the controller reads it from computed styles and accounts for it in fit calculations.

---

## Examples

### Breadcrumb (sliceFrom="end")

```tsx
<OverflowList
  items={crumbs}
  sliceFrom="end"
  renderItem={(crumb, i) => (
    <span key={i}>
      {i > 0 && <span>/</span>}
      {crumb}
    </span>
  )}
  renderMore={(hidden) => <span>/…{hidden.length}/</span>}
/>
```

### Vertical feed with fixed height

```tsx
<div style={{ height: "200px" }}>
  <OverflowList
    items={notifications}
    direction="vertical"
    renderItem={(n, i) => <div key={i}>{n.text}</div>}
    renderMore={(hidden) => <div>+{hidden.length} more</div>}
    className="gap-2"
  />
</div>
```

### Semantic container with forwarded ref

```tsx
const ref = useRef<HTMLElement>(null);

<OverflowList
  renderAs="nav"
  ref={ref}
  items={links}
  renderItem={(l, i) => <a key={i} href={l.href}>{l.label}</a>}
  renderMore={(hidden) => <span>+{hidden.length}</span>}
/>
```

---

## How it works

1. All items render invisibly off-screen at natural size. A `ResizeObserver` tracks each one.
2. Available container size minus the `renderMore` element size = how many items fit.
3. On any size change the controller recomputes the visible slice and triggers a re-render.
4. SSR renders all items; the client trims after the first `ResizeObserver` callback.

---

## License

MIT © Aashish Rai
