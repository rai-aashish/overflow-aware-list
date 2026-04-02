# @overflow-aware-list/svelte — Changelog

## [0.2.0] — 2026-04-02

### Breaking changes — prop renames

Three props have been renamed for a cleaner, more consistent API.

| Old prop | New prop |
|---|---|
| `renderAs` | `as` |
| `sliceFrom` | `keepFrom` |
| `renderMore` snippet | `renderOverflow` snippet |

#### `as` (was `renderAs`)

```svelte
<!-- before -->
<OverflowList renderAs="nav" items={...}>

<!-- after -->
<OverflowList as="nav" items={...}>
```

#### `keepFrom` (was `sliceFrom`)

Describes the user-facing intent (which end to *keep* visible) rather than the internal
implementation detail (which end to *slice* from).

```svelte
<!-- before -->
<OverflowList sliceFrom="end" items={...}>

<!-- after -->
<OverflowList keepFrom="end" items={...}>
```

#### `renderOverflow` snippet (was `renderMore`)

More accurately describes the snippet's role — it renders the overflow indicator, which can
be a badge, ellipsis, popover trigger, or anything else.

```svelte
<!-- before -->
{#snippet renderMore(hidden)}
  <span>+{hidden.length}</span>
{/snippet}

<!-- after -->
{#snippet renderOverflow(hidden)}
  <span>+{hidden.length}</span>
{/snippet}
```

### Performance improvements (via `@overflow-aware-list/core` 0.2.0)

- Resize events that don't change the visible/hidden split no longer trigger a Svelte state
  update or re-render.
- Container style is read in a single `getComputedStyle` call per resize event instead of two.

---

## [0.1.1] — initial patch

Internal fixes and build tooling corrections.

## [0.1.0] — initial release

First release of the Svelte 5 `<OverflowList>` component.
