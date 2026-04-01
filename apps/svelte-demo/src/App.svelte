<script lang="ts">
    import { OverflowList } from "@overflow-aware-list/svelte";
    import { Popover } from "bits-ui";
    import { cn } from "@/lib/utils";

    // ── Links — update these when deploying ───────────────────────────────
    const LINKS = {
        github:     "https://github.com/rai-aashish/overflow-aware-list",
        npmSvelte:  "https://www.npmjs.com/package/@overflow-aware-list/svelte",
        npmReact:   "https://www.npmjs.com/package/@overflow-aware-list/react",
        npmCore:    "https://www.npmjs.com/package/@overflow-aware-list/core",
        reactDemo:  "https://rai-aashish.github.io/overflow-aware-list/react/",
    } as const;

    // ── Demo 1: Tech tags ──────────────────────────────────────────────────
    type Tag = { label: string; bg: string; fg: string };
    const techTags: Tag[] = [
        { label: "JavaScript", bg: "#f7df1e", fg: "#111" },
        { label: "TypeScript", bg: "#3178c6", fg: "#fff" },
        { label: "Svelte", bg: "#ff3e00", fg: "#fff" },
        { label: "React", bg: "#149eca", fg: "#fff" },
        { label: "Vue", bg: "#4fc08d", fg: "#fff" },
        { label: "Angular", bg: "#dd0031", fg: "#fff" },
        { label: "Solid", bg: "#446b9e", fg: "#fff" },
        { label: "Astro", bg: "#ff5d01", fg: "#fff" },
        { label: "Next.js", bg: "#efefef", fg: "#000" },
        { label: "Nuxt", bg: "#00dc82", fg: "#000" },
        { label: "Remix", bg: "#e8ff5a", fg: "#000" },
    ];
    let tagsWidth = $state(65);

    // ── Demo 2: Breadcrumb (sliceFrom="end") ──────────────────────────────
    type Crumb = { label: string };
    const crumbs: Crumb[] = [
        { label: "~" },
        { label: "projects" },
        { label: "overflow-aware-list" },
        { label: "packages" },
        { label: "core" },
        { label: "src" },
        { label: "index.ts" },
    ];
    let crumbWidth = $state(50);

    // ── Demo 3: Notification list (vertical) ──────────────────────────────
    type Notif = { icon: string; text: string; meta: string; kind: "ok" | "info" | "warn" | "pub" };
    const notifs: Notif[] = [
        { icon: "✓", text: "Build succeeded in 1.2s", meta: "just now", kind: "ok" },
        { icon: "↑", text: "v0.2.0 available", meta: "2m ago", kind: "info" },
        { icon: "!", text: "Bundle size +4 kb", meta: "5m ago", kind: "warn" },
        { icon: "✓", text: "14 / 14 tests passed", meta: "12m ago", kind: "ok" },
        { icon: "◎", text: "Published @overflow-aware-list/core", meta: "1h ago", kind: "pub" },
        { icon: "◎", text: "Published @overflow-aware-list/svelte", meta: "1h ago", kind: "pub" },
        { icon: "✓", text: "PR #12 merged", meta: "2h ago", kind: "ok" },
    ];
    let notifsHeight = $state(160);

    // ── Copy to clipboard ─────────────────────────────────────────────────
    let copied = $state(false);
    function copyInstall() {
        navigator.clipboard.writeText("npm install @overflow-aware-list/svelte");
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }
</script>

<div class="page">

    <!-- ── Nav ──────────────────────────────────────────────────────────── -->
    <nav>
        <span class="nav-name">@overflow-aware-list/svelte</span>
        <div class="nav-links">
            <span class="badge">v0.1.0</span>
            <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
            <a href={LINKS.npmSvelte} target="_blank" rel="noopener">npm</a>
        </div>
    </nav>

    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <header class="hero">
        <div class="hero-label">@overflow-aware-list</div>
        <h1>@overflow-aware-list/svelte</h1>
        <p class="hero-sub">
            Fits what fits.<br />
            Squeezes what doesn't.<br />
            Zero dependencies.
        </p>
        <button class="install-cmd" onclick={copyInstall}>
            <span class="prompt">$</span>
            npm install @overflow-aware-list/svelte
            <span class="copy-hint">{copied ? "copied!" : "click to copy"}</span>
        </button>
    </header>

    <!-- ── Demo 01 — Tags ───────────────────────────────────────────────── -->
    <section class="demo-section">
        <div class="demo-header">
            <div class="demo-num">01</div>
            <div>
                <div class="demo-title">Tags</div>
                <div class="demo-meta">direction=horizontal · sliceFrom=start</div>
            </div>
        </div>
        <p class="demo-desc">
            A row of tags. Items that don't fit are hidden and counted in the trailing badge.
            Drag the slider to resize the container. Click <em>+N</em> to see what's hidden.
        </p>

        <div class="slider-row">
            <span class="slider-label">width</span>
            <input type="range" min="15" max="100" bind:value={tagsWidth} />
            <span class="slider-val">{tagsWidth}%</span>
        </div>

        <div class="stage-wrap">
            <div class="stage" style:width="{tagsWidth}%">
                <OverflowList
                    items={techTags}
                    direction="horizontal"
                    sliceFrom="start"
                    class="gap-8"
                >
                    {#snippet renderItem(tag)}
                        <span class="tag" style:background={tag.bg} style:color={tag.fg}>
                            {tag.label}
                        </span>
                    {/snippet}
                    {#snippet renderMore(hidden)}
                        <Popover.Root>
                            <Popover.Trigger>
                                {#snippet child({ props })}
                                    <button {...props} class={cn("more-badge", props.class)}>
                                        +{hidden.length}
                                    </button>
                                {/snippet}
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    sideOffset={6}
                                    align="start"
                                    class="popover-content p-4! max-w-28"
                                >
                                    <div class="flex flex-wrap gap-2">
                                        {#each hidden as tag}
                                            <span class="tag" style:background={tag.bg} style:color={tag.fg}>
                                                {tag.label}
                                            </span>
                                        {/each}
                                    </div>
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    {/snippet}
                </OverflowList>
            </div>
            <div class="stage-ruler" style:width="{tagsWidth}%"></div>
        </div>
    </section>

    <!-- ── Demo 02 — Breadcrumb ─────────────────────────────────────────── -->
    <section class="demo-section">
        <div class="demo-header">
            <div class="demo-num">02</div>
            <div>
                <div class="demo-title">Breadcrumb</div>
                <div class="demo-meta">direction=horizontal · sliceFrom=end</div>
            </div>
        </div>
        <p class="demo-desc">
            sliceFrom=<em>end</em> shows the <em>last</em> N items — ideal for paths and
            breadcrumbs where the deepest segment is most relevant.
            Overflow indicator appears at the <em>start</em>.
        </p>

        <div class="slider-row">
            <span class="slider-label">width</span>
            <input type="range" min="15" max="100" bind:value={crumbWidth} />
            <span class="slider-val">{crumbWidth}%</span>
        </div>

        <div class="stage-wrap">
            <div class="stage crumb-stage" style:width="{crumbWidth}%">
                <OverflowList
                    items={crumbs}
                    direction="horizontal"
                    sliceFrom="end"
                    class="gap-0"
                >
                    {#snippet renderItem(crumb, i)}
                        <span class="crumb">
                            {#if i > 0}<span class="crumb-sep">/</span>{/if}
                            {crumb.label}
                        </span>
                    {/snippet}
                    {#snippet renderMore(hidden)}
                        <span class="crumb-more">
                            <span class="crumb-sep">/</span>
                            <span class="crumb-ellipsis">…{hidden.length}</span>
                            <span class="crumb-sep">/</span>
                        </span>
                    {/snippet}
                </OverflowList>
            </div>
            <div class="stage-ruler" style:width="{crumbWidth}%"></div>
        </div>
    </section>

    <!-- ── Demo 03 — Vertical list ──────────────────────────────────────── -->
    <section class="demo-section">
        <div class="demo-header">
            <div class="demo-num">03</div>
            <div>
                <div class="demo-title">Notification feed</div>
                <div class="demo-meta">direction=vertical · sliceFrom=start</div>
            </div>
        </div>
        <p class="demo-desc">
            Works vertically too. Set a fixed height on the container and only the items
            that physically fit will be rendered in the visible layer.
        </p>

        <div class="slider-row">
            <span class="slider-label">height</span>
            <input type="range" min="60" max="320" bind:value={notifsHeight} />
            <span class="slider-val">{notifsHeight}px</span>
        </div>

        <div class="stage-wrap">
            <div class="stage notif-stage" style:height="{notifsHeight}px">
                <OverflowList
                    items={notifs}
                    direction="vertical"
                    sliceFrom="start"
                    class="gap-1"
                >
                    {#snippet renderItem(notif)}
                        <div class="notif notif--{notif.kind}">
                            <span class="notif-icon">{notif.icon}</span>
                            <span class="notif-text">{notif.text}</span>
                            <span class="notif-meta">{notif.meta}</span>
                        </div>
                    {/snippet}
                    {#snippet renderMore(hidden)}
                        <div class="notif-more">
                            +{hidden.length} more
                        </div>
                    {/snippet}
                </OverflowList>
            </div>
        </div>
    </section>

    <!-- ── How it works ─────────────────────────────────────────────────── -->
    <section class="how-section">
        <h2>How it works</h2>
        <div class="how-grid">
            <div class="how-card">
                <div class="how-num">1</div>
                <div class="how-body">
                    <div class="how-title">Off-screen measure</div>
                    <p>All items render invisibly at natural size. A ResizeObserver tracks each one.</p>
                </div>
            </div>
            <div class="how-card">
                <div class="how-num">2</div>
                <div class="how-body">
                    <div class="how-title">Compute visible count</div>
                    <p>Available container width (or height) minus the +N badge size equals how many items fit.</p>
                </div>
            </div>
            <div class="how-card">
                <div class="how-num">3</div>
                <div class="how-body">
                    <div class="how-title">Render only what fits</div>
                    <p>The visible layer shows the computed slice. Container and item resize triggers a recompute.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ── Other packages ───────────────────────────────────────────────── -->
    <section class="install-section">
        <h2>Other packages</h2>
        <div class="install-grid">
            <a class="install-card install-card--link" href={LINKS.reactDemo} target="_blank" rel="noopener">
                <div class="install-fw">React</div>
                <code>@overflow-aware-list/react</code>
                <div class="install-card-meta">Live demo →</div>
            </a>
        </div>
    </section>

    <!-- ── Footer ───────────────────────────────────────────────────────── -->
    <footer>
        <span>@overflow-aware-list/svelte</span>
        <span class="footer-sep">·</span>
        <span>MIT license</span>
        <span class="footer-sep">·</span>
        <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
        <span class="footer-sep">·</span>
        <a href={LINKS.npmSvelte} target="_blank" rel="noopener">npm</a>
    </footer>

</div>

<style>
    @import "tailwindcss";

    /* ── Design tokens — on :root so bits-ui portals can inherit them ──── */
    :global(:root) {
        --bg: #0c0b0a;
        --surface: #161513;
        --surface-2: #201e1b;
        --border: rgba(255,255,255,0.08);
        --text: #f0ebe3;
        --muted: #7a7570;
        --faint: #3a3830;
        --accent: #f0c040;
        --accent-fg: #0c0b0a;
        --green: #5dda8a;
        --red: #ff6b6b;
        --blue: #60a5fa;
        --amber: #f0c040;
    }

    /* ── Reset & base ──────────────────────────────────────────────────── */
    :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
    :global(body) {
        background: #0c0b0a;
        color: #f0ebe3;
        font-family: "IBM Plex Mono", monospace;
        font-size: 14px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    /* ── Page layout ───────────────────────────────────────────────────── */
    .page {
        max-width: 860px;
        margin: 0 auto;
        padding: 0 24px 80px;
    }

    /* ── Nav ───────────────────────────────────────────────────────────── */
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 0;
    }
    .nav-name {
        font-size: 13px;
        color: var(--muted);
        letter-spacing: 0.04em;
    }
    .nav-links {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    .nav-links a {
        color: var(--muted);
        text-decoration: none;
        font-size: 13px;
        transition: color 0.15s;
    }
    .nav-links a:hover { color: var(--text); }
    .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 100px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        color: var(--muted);
    }

    /* ── Hero ──────────────────────────────────────────────────────────── */
    .hero {
        padding: 72px 0 64px;
        border-bottom: 1px solid var(--border);
    }
    .hero-label {
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 24px;
    }
    h1 {
        font-family: "Syne", sans-serif;
        font-size: clamp(28px, 5vw, 48px);
        font-weight: 800;
        line-height: 0.92;
        letter-spacing: -0.03em;
        color: var(--text);
        margin-bottom: 32px;
    }
    .hero-sub {
        font-size: 18px;
        color: var(--muted);
        line-height: 1.8;
        margin-bottom: 36px;
        font-style: italic;
    }
    .install-cmd {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 12px 20px;
        font-family: "IBM Plex Mono", monospace;
        font-size: 14px;
        color: var(--text);
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;
        margin-bottom: 40px;
    }
    .install-cmd:hover {
        border-color: rgba(255,255,255,0.2);
        background: var(--surface-2);
    }
    .prompt { color: var(--accent); user-select: none; }
    .copy-hint {
        font-size: 11px;
        color: var(--muted);
        margin-left: 8px;
        transition: color 0.15s;
    }
    .install-cmd:hover .copy-hint { color: var(--accent); }
    .hero-stats {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .stat { display: flex; flex-direction: column; gap: 1px; }
    .stat-val {
        font-size: 22px;
        font-family: "Syne", sans-serif;
        font-weight: 700;
        color: var(--text);
        line-height: 1;
    }
    .stat-label { font-size: 11px; color: var(--muted); letter-spacing: 0.06em; }
    .stat-sep { color: var(--faint); font-size: 20px; line-height: 1; }

    /* ── Demo sections ─────────────────────────────────────────────────── */
    .demo-section {
        padding: 56px 0;
        border-bottom: 1px solid var(--border);
    }
    .demo-header {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 16px;
    }
    .demo-num {
        font-family: "Syne", sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: var(--accent);
        padding-top: 3px;
        min-width: 24px;
    }
    .demo-title {
        font-family: "Syne", sans-serif;
        font-size: 22px;
        font-weight: 700;
        color: var(--text);
        line-height: 1.2;
    }
    .demo-meta {
        font-size: 12px;
        color: var(--muted);
        margin-top: 4px;
        letter-spacing: 0.02em;
    }
    .demo-desc {
        font-size: 14px;
        color: var(--muted);
        line-height: 1.7;
        margin-bottom: 28px;
        max-width: 560px;
    }
    .demo-desc em {
        color: var(--text);
        font-style: normal;
        font-weight: 500;
    }

    /* ── Slider ────────────────────────────────────────────────────────── */
    .slider-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
    }
    .slider-label {
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
        min-width: 36px;
    }
    .slider-val {
        font-size: 12px;
        color: var(--accent);
        min-width: 40px;
        text-align: right;
    }
    input[type="range"] {
        flex: 1;
        -webkit-appearance: none;
        height: 2px;
        background: var(--faint);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        max-width: 320px;
    }
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--accent);
        cursor: pointer;
        transition: transform 0.1s;
    }
    input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.2); }

    /* ── Demo stage ────────────────────────────────────────────────────── */
    .stage-wrap { position: relative; }
    .stage {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        transition: width 0.05s;
        min-width: 0;
    }
    .stage-ruler {
        height: 2px;
        background: linear-gradient(to right, var(--accent) 80%, transparent);
        margin-top: 6px;
        border-radius: 2px;
        transition: width 0.05s;
        opacity: 0.3;
    }
    .crumb-stage { padding: 10px 16px; }
    .notif-stage {
        overflow: hidden;
        transition: height 0.05s;
        padding: 8px;
    }

    /* ── Gap utility — read by core's getGap() ─────────────────────────── */
    :global(.gap-8)  { gap: 8px; }
    :global(.gap-1)  { gap: 4px; }
    :global(.gap-0)  { gap: 0; }

    /* ── Tag items ─────────────────────────────────────────────────────── */
    .tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        letter-spacing: 0.02em;
    }
    .more-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4px 10px;
        border-radius: 4px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        font-size: 12px;
        font-family: "IBM Plex Mono", monospace;
        color: var(--muted);
        white-space: nowrap;
        flex-shrink: 0;
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s;
        -webkit-appearance: none;
        appearance: none;
    }
    .more-badge:hover,
    :global([data-state="open"]) .more-badge {
        border-color: var(--accent);
        color: var(--accent);
    }

    /* ── bits-ui Popover content ───────────────────────────────────────── */
    :global(.popover-content) {
        z-index: 50;
        min-width: 11rem;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.12);
        background: var(--surface-2);
        color: var(--text);
        font-family: "IBM Plex Mono", monospace;
        font-size: 12px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.5);
        outline: none;
    }
    :global(.popover-content[data-state="open"]) {
        animation: popover-in 0.1s ease;
    }
    :global(.popover-content[data-state="closed"]) {
        animation: popover-out 0.08s ease;
    }
    @keyframes popover-in {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes popover-out {
        from { opacity: 1; transform: translateY(0); }
        to   { opacity: 0; transform: translateY(-4px); }
    }

    /* ── Breadcrumb items ──────────────────────────────────────────────── */
    .crumb {
        display: inline-flex;
        align-items: center;
        font-size: 13px;
        color: var(--muted);
        white-space: nowrap;
    }
    .crumb:last-child { color: var(--text); }
    .crumb-sep {
        margin: 0 6px;
        color: var(--faint);
        user-select: none;
    }
    .crumb-more {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
    }
    .crumb-ellipsis {
        font-size: 12px;
        color: var(--accent);
        background: var(--surface-2);
        border: 1px solid var(--border);
        padding: 1px 7px;
        border-radius: 4px;
    }

    /* ── Notification items ────────────────────────────────────────────── */
    .notif {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 10px;
        border-radius: 5px;
        background: var(--surface-2);
        font-size: 12px;
        white-space: nowrap;
        min-width: 0;
    }
    .notif-icon {
        font-size: 11px;
        flex-shrink: 0;
        width: 18px;
        text-align: center;
    }
    .notif--ok   .notif-icon { color: var(--green); }
    .notif--info .notif-icon { color: var(--blue); }
    .notif--warn .notif-icon { color: var(--amber); }
    .notif--pub  .notif-icon { color: var(--muted); }
    .notif-text { flex: 1; overflow: hidden; text-overflow: ellipsis; color: var(--text); }
    .notif-meta { font-size: 11px; color: var(--muted); flex-shrink: 0; margin-left: auto; }
    .notif-more {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 10px;
        font-size: 12px;
        color: var(--accent);
        background: transparent;
        border: 1px dashed var(--faint);
        border-radius: 5px;
        cursor: pointer;
    }

    /* ── How it works ──────────────────────────────────────────────────── */
    .how-section {
        padding: 56px 0;
        border-bottom: 1px solid var(--border);
    }
    .how-section h2,
    .install-section h2 {
        font-family: "Syne", sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: var(--text);
        margin-bottom: 32px;
    }
    .how-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
    }
    .how-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        display: flex;
        gap: 14px;
    }
    .how-num {
        font-family: "Syne", sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: var(--faint);
        line-height: 1;
        flex-shrink: 0;
    }
    .how-title {
        font-size: 13px;
        font-weight: 500;
        color: var(--text);
        margin-bottom: 8px;
    }
    .how-body p {
        font-size: 12px;
        color: var(--muted);
        line-height: 1.7;
    }
    .how-body code {
        font-family: "IBM Plex Mono", monospace;
        font-size: 11px;
        background: var(--surface-2);
        padding: 1px 5px;
        border-radius: 3px;
        color: var(--accent);
    }

    /* ── Other packages section ────────────────────────────────────────── */
    .install-section { padding: 56px 0; }
    .install-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
    }
    .install-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px 20px;
    }
    .install-card--link {
        text-decoration: none;
        display: block;
        transition: border-color 0.15s, background 0.15s;
    }
    .install-card--link:hover {
        border-color: rgba(255,255,255,0.2);
        background: var(--surface-2);
    }
    .install-fw {
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .install-card code {
        font-family: "IBM Plex Mono", monospace;
        font-size: 12px;
        color: var(--text);
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .install-card-meta {
        font-size: 11px;
        color: var(--accent);
        margin-top: 10px;
        letter-spacing: 0.04em;
    }

    /* ── Footer ────────────────────────────────────────────────────────── */
    footer {
        padding: 32px 0 0;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        color: var(--muted);
    }
    footer a {
        color: var(--muted);
        text-decoration: none;
        transition: color 0.15s;
    }
    footer a:hover { color: var(--text); }
    .footer-sep { color: var(--faint); }
</style>
