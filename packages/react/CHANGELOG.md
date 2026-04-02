# @overflow-aware-list/react — Changelog

## [0.2.0] — 2026-04-02

### Breaking changes — prop renames

Three props have been renamed for clearer, more idiomatic React API.

| Old prop | New prop |
|---|---|
| `renderAs` | `as` |
| `sliceFrom` | `keepFrom` |
| `renderMore` | `renderOverflow` |

#### `as` (was `renderAs`)

Follows the standard polymorphic component convention used by Radix UI, styled-components,
Chakra UI, and others.

```tsx
// before
<OverflowList renderAs="nav" ... />

// after
<OverflowList as="nav" ... />
```

#### `keepFrom` (was `sliceFrom`)

Describes the user-facing intent (which end to *keep* visible) rather than the internal
implementation detail (which end to *slice* from).

```tsx
// before
<OverflowList sliceFrom="end" ... />

// after
<OverflowList keepFrom="end" ... />
```

#### `renderOverflow` (was `renderMore`)

More accurately describes the prop's role — it renders the overflow indicator, which can
be a badge, ellipsis, dropdown trigger, or anything else.

```tsx
// before
<OverflowList renderMore={(hidden) => <span>+{hidden.length}</span>} />

// after
<OverflowList renderOverflow={(hidden) => <span>+{hidden.length}</span>} />
```

### Performance improvements (via `@overflow-aware-list/core` 0.2.0)

- Resize events that don't change the visible/hidden split no longer trigger a React re-render.
- Container style is read in a single `getComputedStyle` call per resize event instead of two.

---

## [0.1.1] — initial patch

Internal fixes and build tooling corrections.

## [0.1.0] — initial release

First release of the React `<OverflowList>` component.
