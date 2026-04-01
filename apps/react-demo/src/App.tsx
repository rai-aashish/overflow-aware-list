import { useState } from "react";
import { OverflowList } from "@overflow-aware-list/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// ── Links — update these when deploying ───────────────────────────────────
const LINKS = {
    github:      "https://github.com/rai-aashish/overflow-aware-list",
    npmReact:    "https://www.npmjs.com/package/@overflow-aware-list/react",
    npmSvelte:   "https://www.npmjs.com/package/@overflow-aware-list/svelte",
    npmCore:     "https://www.npmjs.com/package/@overflow-aware-list/core",
    svelteDemo:  "https://rai-aashish.github.io/overflow-aware-list/svelte",
} as const;

// ── Demo 1: Tech tags ──────────────────────────────────────────────────────
type Tag = { label: string; bg: string; fg: string };
const techTags: Tag[] = [
    { label: "JavaScript", bg: "#f7df1e", fg: "#111" },
    { label: "TypeScript", bg: "#3178c6", fg: "#fff" },
    { label: "React", bg: "#149eca", fg: "#fff" },
    { label: "Svelte", bg: "#ff3e00", fg: "#fff" },
    { label: "Vue", bg: "#4fc08d", fg: "#fff" },
    { label: "Angular", bg: "#dd0031", fg: "#fff" },
    { label: "Solid", bg: "#446b9e", fg: "#fff" },
    { label: "Astro", bg: "#ff5d01", fg: "#fff" },
    { label: "Next.js", bg: "#efefef", fg: "#000" },
    { label: "Nuxt", bg: "#00dc82", fg: "#000" },
    { label: "Remix", bg: "#e8ff5a", fg: "#000" },
];

// ── Demo 2: Breadcrumb (sliceFrom="end") ──────────────────────────────────
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

// ── Demo 3: Notification list (vertical) ──────────────────────────────────
type Notif = { icon: string; text: string; meta: string; kind: "ok" | "info" | "warn" | "pub" };
const notifs: Notif[] = [
    { icon: "✓", text: "Build succeeded in 1.2s", meta: "just now", kind: "ok" },
    { icon: "↑", text: "v0.2.0 available", meta: "2m ago", kind: "info" },
    { icon: "!", text: "Bundle size +4 kb", meta: "5m ago", kind: "warn" },
    { icon: "✓", text: "14 / 14 tests passed", meta: "12m ago", kind: "ok" },
    { icon: "◎", text: "Published @overflow-aware-list/core", meta: "1h ago", kind: "pub" },
    { icon: "◎", text: "Published @overflow-aware-list/react", meta: "1h ago", kind: "pub" },
    { icon: "✓", text: "PR #12 merged", meta: "2h ago", kind: "ok" },
];

export default function App() {
    const [tagsWidth, setTagsWidth] = useState(65);
    const [crumbWidth, setCrumbWidth] = useState(50);
    const [notifsHeight, setNotifsHeight] = useState(160);
    const [copied, setCopied] = useState(false);

    function copyInstall() {
        navigator.clipboard.writeText("npm install @overflow-aware-list/react");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="page">

            {/* ── Nav ──────────────────────────────────────────────────────── */}
            <nav>
                <span className="nav-name">@overflow-aware-list/react</span>
                <div className="nav-links">
                    <span className="badge">v0.1.0</span>
                    <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
                    <a href={LINKS.npmReact} target="_blank" rel="noopener">npm</a>
                </div>
            </nav>

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <header className="hero">
                <div className="hero-label">@overflow-aware-list</div>
                <h1>@overflow-aware-list/react</h1>
                <p className="hero-sub">
                    Fits what fits.<br />
                    Squeezes what doesn't.<br />
                    Zero dependencies.
                </p>
                <button className="install-cmd" onClick={copyInstall}>
                    <span className="prompt">$</span>
                    npm install @overflow-aware-list/react
                    <span className="copy-hint">{copied ? "copied!" : "click to copy"}</span>
                </button>
            </header>

            {/* ── Demo 01 — Tags ───────────────────────────────────────────── */}
            <section className="demo-section">
                <div className="demo-header">
                    <div className="demo-num">01</div>
                    <div>
                        <div className="demo-title">Tags</div>
                        <div className="demo-meta">direction=horizontal · sliceFrom=start</div>
                    </div>
                </div>
                <p className="demo-desc">
                    A row of tags. Items that don't fit are hidden and counted in the trailing badge.
                    Drag the slider to resize the container. Click <em>+N</em> to see what's hidden.
                </p>
                <div className="slider-row">
                    <span className="slider-label">width</span>
                    <input type="range" min="15" max="100" value={tagsWidth} onChange={e => setTagsWidth(Number(e.target.value))} />
                    <span className="slider-val">{tagsWidth}%</span>
                </div>
                <div className="stage-wrap">
                    <div className="stage" style={{ width: `${tagsWidth}%` }}>
                        <OverflowList
                            items={techTags}
                            direction="horizontal"
                            sliceFrom="start"
                            className="gap-8"
                            renderItem={(tag) => (
                                <span className="tag" style={{ background: tag.bg, color: tag.fg }}>
                                    {tag.label}
                                </span>
                            )}
                            renderMore={(hidden) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="more-badge">
                                            +{hidden.length}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent  className="p-4! max-w-28">
                                            <div className="flex flex-wrap gap-3">
                                                {hidden.map((tag) => (
                                                    <span key={tag.label} className="tag" style={{ background: tag.bg, color: tag.fg }}>
                                                        {tag.label}
                                                    </span>
                                                ))}
                                            </div>

                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                    <div className="stage-ruler" style={{ width: `${tagsWidth}%` }} />
                </div>
            </section>

            {/* ── Demo 02 — Breadcrumb ─────────────────────────────────────── */}
            <section className="demo-section">
                <div className="demo-header">
                    <div className="demo-num">02</div>
                    <div>
                        <div className="demo-title">Breadcrumb</div>
                        <div className="demo-meta">direction=horizontal · sliceFrom=end</div>
                    </div>
                </div>
                <p className="demo-desc">
                    sliceFrom=<em>end</em> shows the <em>last</em> N items — ideal for paths and
                    breadcrumbs where the deepest segment is most relevant.
                    Overflow indicator appears at the <em>start</em>.
                </p>
                <div className="slider-row">
                    <span className="slider-label">width</span>
                    <input type="range" min="15" max="100" value={crumbWidth} onChange={e => setCrumbWidth(Number(e.target.value))} />
                    <span className="slider-val">{crumbWidth}%</span>
                </div>
                <div className="stage-wrap">
                    <div className="stage crumb-stage" style={{ width: `${crumbWidth}%` }}>
                        <OverflowList
                            items={crumbs}
                            direction="horizontal"
                            sliceFrom="end"
                            className="gap-0"
                            renderItem={(crumb, i) => (
                                <span className="crumb">
                                    {i > 0 && <span className="crumb-sep">/</span>}
                                    {crumb.label}
                                </span>
                            )}
                            renderMore={(hidden) => (
                                <span className="crumb-more">
                                    <span className="crumb-sep">/</span>
                                    <span className="crumb-ellipsis">…{hidden.length}</span>
                                    <span className="crumb-sep">/</span>
                                </span>
                            )}
                        />
                    </div>
                    <div className="stage-ruler" style={{ width: `${crumbWidth}%` }} />
                </div>
            </section>

            {/* ── Demo 03 — Vertical list ──────────────────────────────────── */}
            <section className="demo-section">
                <div className="demo-header">
                    <div className="demo-num">03</div>
                    <div>
                        <div className="demo-title">Notification feed</div>
                        <div className="demo-meta">direction=vertical · sliceFrom=start</div>
                    </div>
                </div>
                <p className="demo-desc">
                    Works vertically too. Set a fixed height on the container and only the items
                    that physically fit will be rendered in the visible layer.
                </p>
                <div className="slider-row">
                    <span className="slider-label">height</span>
                    <input type="range" min="60" max="320" value={notifsHeight} onChange={e => setNotifsHeight(Number(e.target.value))} />
                    <span className="slider-val">{notifsHeight}px</span>
                </div>
                <div className="stage-wrap">
                    <div className="stage notif-stage" style={{ height: `${notifsHeight}px` }}>
                        <OverflowList
                            items={notifs}
                            direction="vertical"
                            sliceFrom="start"
                            className="gap-1"
                            renderItem={(notif) => (
                                <div className={`notif notif--${notif.kind}`}>
                                    <span className="notif-icon">{notif.icon}</span>
                                    <span className="notif-text">{notif.text}</span>
                                    <span className="notif-meta">{notif.meta}</span>
                                </div>
                            )}
                            renderMore={(hidden) => (
                                <div className="notif-more">+{hidden.length} more</div>
                            )}
                        />
                    </div>
                </div>
            </section>

            {/* ── How it works ─────────────────────────────────────────────── */}
            <section className="how-section">
                <h2>How it works</h2>
                <div className="how-grid">
                    <div className="how-card">
                        <div className="how-num">1</div>
                        <div className="how-body">
                            <div className="how-title">Off-screen measure</div>
                            <p>All items render invisibly at natural size. A ResizeObserver tracks each one.</p>
                        </div>
                    </div>
                    <div className="how-card">
                        <div className="how-num">2</div>
                        <div className="how-body">
                            <div className="how-title">Compute visible count</div>
                            <p>Available container width (or height) minus the +N badge size equals how many items fit.</p>
                        </div>
                    </div>
                    <div className="how-card">
                        <div className="how-num">3</div>
                        <div className="how-body">
                            <div className="how-title">Render only what fits</div>
                            <p>The visible layer shows the computed slice. Container and item resize triggers a recompute.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Other packages ───────────────────────────────────────────── */}
            <section className="install-section">
                <h2>Other packages</h2>
                <div className="install-grid">
                    <a className="install-card install-card--link" href={LINKS.svelteDemo} target="_blank" rel="noopener">
                        <div className="install-fw">Svelte 5</div>
                        <code>@overflow-aware-list/svelte</code>
                        <div className="install-card-meta">Live demo →</div>
                    </a>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer>
                <span>@overflow-aware-list/react</span>
                <span className="footer-sep">·</span>
                <span>MIT license</span>
                <span className="footer-sep">·</span>
                <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
                <span className="footer-sep">·</span>
                <a href={LINKS.npmReact} target="_blank" rel="noopener">npm</a>
            </footer>

        </div>
    );
}
