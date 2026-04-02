# @overflow-aware-list/core — Changelog

## [0.2.0] — 2026-04-02

### Performance improvements

- **Single `getComputedStyle` call per recompute** — previously `getAvailableSize` and `getGap`
  each triggered a separate `getComputedStyle` on the container. Both now share one call per
  recompute cycle, halving forced style recalculations on every resize event.

- **Skip no-op re-renders** — `onStateChange` is no longer called when a resize event produces
  the same `visibleCount` as before. If the container width changes but the same number of items
  still fit, no state update is emitted. This eliminates unnecessary React/Svelte re-renders
  during smooth resize interactions.

- **Hoisted direction check** — the `direction === "horizontal"` comparison is evaluated once per
  recompute instead of once per item, removing N redundant string comparisons from the measurement
  loop.

### API additions (backward-compatible)

`getAvailableSize` and `getGap` now accept optional pre-computed `CSSStyleDeclaration` and
`DOMRect` arguments. Existing call sites work unchanged; pass them when you already have the
values to avoid redundant DOM reads in custom integrations.

```ts
// before — two getComputedStyle calls
const size = getAvailableSize(el, "horizontal");
const gap  = getGap(el, "horizontal");

// after — one call, shared
const style = getComputedStyle(el);
const rect  = el.getBoundingClientRect();
const size  = getAvailableSize(el, "horizontal", style, rect);
const gap   = getGap(el, "horizontal", style);
```

---

## [0.1.1] — initial patch

Internal fixes and build tooling corrections.

## [0.1.0] — initial release

First release of the framework-agnostic `OverflowListController` and pure computation utilities
(`computeVisibleCount`, `computeSlice`, `getAvailableSize`, `getGap`).
