# Changelog

All notable changes to this project are documented here.
This project follows [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-04-02

### Breaking changes

All three packages (`core`, `react`, `svelte`) rename three props for improved developer experience.
Update your usage before upgrading.

| Old name | New name | Packages |
|---|---|---|
| `renderAs` | `as` | `react`, `svelte` |
| `sliceFrom` | `keepFrom` | `react`, `svelte` |
| `renderMore` | `renderOverflow` | `react`, `svelte` |

#### `as` (was `renderAs`)

```tsx
// before
<OverflowList renderAs="nav" ... />

// after
<OverflowList as="nav" ... />
```

#### `keepFrom` (was `sliceFrom`)

```tsx
// before
<OverflowList sliceFrom="end" ... />

// after
<OverflowList keepFrom="end" ... />
```

#### `renderOverflow` / `{#snippet renderOverflow}` (was `renderMore` / `{#snippet renderMore}`)

```tsx
// React — before
<OverflowList renderMore={(hidden) => <span>+{hidden.length}</span>} />

// React — after
<OverflowList renderOverflow={(hidden) => <span>+{hidden.length}</span>} />
```

```svelte
<!-- Svelte — before -->
{#snippet renderMore(hidden)}<span>+{hidden.length}</span>{/snippet}

<!-- Svelte — after -->
{#snippet renderOverflow(hidden)}<span>+{hidden.length}</span>{/snippet}
```

### Performance improvements (`@overflow-aware-list/core`)

- **Single `getComputedStyle` call per recompute** — `getAvailableSize` and `getGap` previously
  each called `getComputedStyle` on the container element. Both are now called once per recompute
  cycle and the result is shared. `getAvailableSize` and `getGap` accept an optional pre-computed
  `CSSStyleDeclaration` (and `DOMRect` for `getAvailableSize`) so custom integrations can do
  the same.
- **Skip no-op re-renders** — `onStateChange` is no longer called when a resize event produces
  the same visible/hidden split as before. This prevents unnecessary React/Svelte re-renders
  during smooth container resizes where item count doesn't change.
- **Hoisted direction check** — the `direction === "horizontal"` comparison is now evaluated once
  per recompute rather than once per item, eliminating N redundant string comparisons.

---

## [0.1.1] — initial patch

Internal fixes and build tooling corrections.

---

## [0.1.0] — initial release

- `@overflow-aware-list/core` — framework-agnostic `OverflowListController` and pure computation functions
- `@overflow-aware-list/react` — React 18/19 `<OverflowList>` component
- `@overflow-aware-list/svelte` — Svelte 5 `<OverflowList>` component
