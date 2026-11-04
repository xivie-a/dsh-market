const STYLES = `
.dm-root {
  color-scheme: light dark;
  --dm-accent: var(--dsh-accent, #4d6bfe);
  --dm-bg: Canvas;
  --dm-text: CanvasText;
  --dm-muted: color-mix(in srgb, CanvasText 68%, Canvas);
  --dm-soft: color-mix(in srgb, CanvasText 5%, Canvas);
  --dm-line: var(--dsh-border, color-mix(in srgb, CanvasText 14%, Canvas));
  --dm-ink: color-mix(in srgb, CanvasText 72%, var(--dm-accent));
  --dm-tint: color-mix(in srgb, var(--dm-accent) 9%, Canvas);
  box-sizing: border-box; display: flex; flex-direction: column; gap: 22px;
  width: 100%; max-width: 1280px; height: 100%; min-width: 0; margin: 0 auto;
  padding: 36px 32px 64px; overflow: auto; color: var(--dm-text);
  background: radial-gradient(ellipse 85% 280px at 15% 0, color-mix(in srgb, var(--dm-accent) 7%, transparent), transparent 80%), var(--dm-bg);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13px; line-height: 1.5; -webkit-font-smoothing: antialiased;
  scrollbar-color: color-mix(in srgb, CanvasText 24%, Canvas) transparent; scrollbar-width: thin;
}
.dm-root *, .dm-root *::before, .dm-root *::after { box-sizing: border-box; }
[data-theme="dark"] .dm-root, [data-color-scheme="dark"] .dm-root, .dark .dm-root, .dm-root[data-theme="dark"] { color-scheme: dark; }
[data-theme="light"] .dm-root, [data-color-scheme="light"] .dm-root, .light .dm-root, .dm-root[data-theme="light"] { color-scheme: light; }
.dm-root button, .dm-root input, .dm-root select { font: inherit; }
.dm-root button { -webkit-tap-highlight-color: transparent; }
.dm-root :where(button, input, select, a, [tabindex]):focus-visible { outline: 2px solid var(--dm-ink); outline-offset: 4px; }
.dm-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.dm-hero > div:first-child { min-width: 0; }
.dm-hero h1 { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 0; color: var(--dm-text); font-size: 28px; font-weight: 700; line-height: 1.3; letter-spacing: -.045em; }
.dm-pill { padding: 4px 9px; border: 1px solid color-mix(in srgb, var(--dm-accent) 18%, Canvas); border-radius: 8px; background: var(--dm-tint); color: var(--dm-ink); font-size: 11px; font-weight: 600; line-height: 1.5; letter-spacing: 0; white-space: nowrap; }
.dm-sub { margin: 9px 0 0; color: var(--dm-muted); font-size: 13px; line-height: 1.7; }
.dm-ghost, .dm-state button, .dm-bgrow button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 7px 12px; border: 1px solid var(--dm-line); border-radius: 10px; background: var(--dm-bg); color: var(--dm-muted); font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer; transition: background .16s ease, border-color .16s ease, color .16s ease; }
.dm-ghost:hover, .dm-state button:hover, .dm-bgrow button:hover { border-color: color-mix(in srgb, var(--dm-accent) 45%, var(--dm-line)); background: var(--dm-tint); color: var(--dm-ink); }
.dm-ghost[aria-expanded="true"] { background: var(--dm-tint); color: var(--dm-ink); }
.dm-tools, .dm-tools-row { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dm-tools-row { flex-wrap: wrap; justify-content: space-between; }
.dm-search-wrap { position: relative; display: flex; align-items: center; flex: 1 1 auto; min-width: 0; max-width: none; }
.dm-search-wrap svg { position: absolute; left: 15px; color: var(--dm-muted); pointer-events: none; }
.dm-search, .dm-select, .dm-bgpop input { min-width: 0; min-height: 44px; border: 1px solid var(--dm-line); border-radius: 12px; background: var(--dm-bg); color: var(--dm-text); transition: border-color .16s ease, box-shadow .16s ease; }
.dm-search { width: 100%; padding: 11px 15px 11px 42px; font-size: 13px; }
.dm-search::placeholder, .dm-bgpop input::placeholder { color: var(--dm-muted); opacity: 1; }
.dm-search:focus, .dm-select:focus, .dm-bgpop input:focus { border-color: var(--dm-ink); outline: 2px solid color-mix(in srgb, var(--dm-accent) 24%, transparent); outline-offset: 2px; }
.dm-select { flex: 0 0 auto; max-width: 45%; padding: 10px 14px; font-size: 12px; cursor: pointer; }
.dm-select option { background: var(--dm-bg); color: var(--dm-text); }
.dm-chips { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 20px; border-bottom: 1px solid var(--dm-line); }
.dm-chip { display: inline-flex; align-items: center; justify-content: center; min-height: 33px; padding: 6px 11px; border: 1px solid transparent; border-radius: 9px; background: var(--dm-soft); color: var(--dm-muted); font-size: 12px; font-weight: 500; cursor: pointer; transition: background .16s ease, border-color .16s ease, color .16s ease; }
.dm-chip:hover { background: var(--dm-tint); color: var(--dm-ink); }
.dm-chip[aria-pressed="true"] { border-color: color-mix(in srgb, var(--dm-accent) 28%, Canvas); background: var(--dm-tint); color: var(--dm-ink); font-weight: 650; }
.dm-chip-count { margin-left: 7px; color: var(--dm-muted); font-size: 11px; font-weight: 400; font-variant-numeric: tabular-nums; }
.dm-chip[aria-pressed="true"] .dm-chip-count { color: inherit; }
.dm-main, .dm-section { display: flex; flex-direction: column; min-width: 0; }
.dm-main { gap: 28px; }
.dm-section { gap: 13px; }
.dm-section-head { display: flex; align-items: center; gap: 9px; min-height: 22px; }
.dm-section-head::before { content: ""; width: 5px; height: 5px; flex: none; border-radius: 50%; background: var(--dm-ink); }
.dm-section-head span { color: var(--dm-muted); font-size: 12px; font-weight: 650; letter-spacing: .02em; }
.dm-eyebrow { color: var(--dm-muted); font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
.dm-featured { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.dm-hero-card { position: relative; display: flex; align-items: center; gap: 18px; min-width: 0; min-height: 180px; padding: 23px; border: 1px solid var(--dm-line); border-radius: 18px; background: radial-gradient(ellipse at 100% 0, color-mix(in srgb, var(--dm-accent) 11%, transparent), transparent 72%), var(--dm-bg); cursor: pointer; transition: border-color .18s ease, box-shadow .18s ease; }
.dm-hero-main { position: relative; display: flex; flex: 1 1 auto; flex-direction: column; gap: 12px; min-width: 0; }
.dm-hero-side { position: relative; display: flex; flex: none; flex-direction: column; align-items: flex-end; gap: 10px; }
.dm-hero-card .dm-thumb { width: 54px; height: 54px; border-radius: 14px; font-size: 22px; }
.dm-hero-title { margin: 0; overflow: hidden; color: var(--dm-text); font-size: 17px; font-weight: 650; line-height: 1.5; letter-spacing: -.025em; text-overflow: ellipsis; white-space: nowrap; }
.dm-hero-desc, .dm-desc { display: -webkit-box; margin: 0; overflow: hidden; color: var(--dm-muted); font-size: 13px; line-height: 1.75; overflow-wrap: anywhere; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.dm-hero-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.dm-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; min-width: 0; }
.dm-card { display: flex; flex-direction: column; gap: 13px; min-width: 0; min-height: 192px; padding: 20px; border: 1px solid var(--dm-line); border-radius: 16px; background: var(--dm-bg); cursor: pointer; transition: border-color .18s ease, box-shadow .18s ease; }
.dm-card-top { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dm-thumb { display: grid; place-items: center; flex: none; width: 46px; height: 46px; overflow: hidden; border: 1px solid var(--dm-line); border-radius: 12px; background: var(--dm-soft); color: var(--dm-text); font-size: 18px; font-weight: 650; }
.dm-thumb img { display: block; width: 100%; height: 100%; object-fit: contain; }
.dm-titles { display: flex; flex: 1 1 auto; flex-direction: column; gap: 4px; min-width: 0; }
.dm-title { margin: 0; overflow: hidden; color: var(--dm-text); font-size: 14px; font-weight: 650; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap; }
.dm-pkg { display: block; min-width: 0; overflow: hidden; color: var(--dm-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10.5px; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap; }
.dm-desc { min-height: 45.5px; }
.dm-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; }
.dm-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; min-width: 0; color: var(--dm-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.dm-tag { max-width: 100%; padding: 3px 7px; overflow: hidden; border-radius: 5px; background: var(--dm-soft); line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
.dm-btn { display: inline-flex; align-items: center; justify-content: center; flex: none; min-height: 33px; padding: 6px 16px; border: 1px solid var(--dm-line); border-radius: 9px; background: var(--dm-soft); color: var(--dm-text); font-size: 12px; font-weight: 650; line-height: 1.5; white-space: nowrap; cursor: pointer; transition: background .16s ease, border-color .16s ease; }
.dm-btn--primary { border-color: color-mix(in srgb, var(--dm-accent) 22%, Canvas); background: var(--dm-tint); color: var(--dm-ink); }
.dm-btn--primary:hover:not(:disabled) { border-color: var(--dm-ink); background: color-mix(in srgb, var(--dm-accent) 16%, Canvas); }
.dm-btn:active:not(:disabled) { background: color-mix(in srgb, var(--dm-accent) 23%, Canvas); }
.dm-btn:disabled { border-style: dashed; color: var(--dm-muted); cursor: wait; }
.dm-installed { display: inline-flex; align-items: center; justify-content: center; flex: none; gap: 5px; min-height: 33px; padding: 6px 10px; border-radius: 9px; background: var(--dm-soft); color: var(--dm-muted); font-size: 11px; white-space: nowrap; }
.dm-hero-card .dm-btn { min-height: 38px; padding: 8px 18px; }
.dm-card[aria-current="true"], .dm-hero-card[aria-current="true"] { border-color: var(--dm-ink); box-shadow: inset 0 0 0 1px var(--dm-ink); }
@media (hover: hover) {
  .dm-card:hover, .dm-hero-card:hover { border-color: color-mix(in srgb, var(--dm-accent) 45%, var(--dm-line)); box-shadow: 0 8px 28px rgb(16 24 48 / 6%); }
}
.dm-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; min-height: 240px; padding: 40px 20px; color: var(--dm-muted); text-align: center; overflow-wrap: anywhere; }
.dm-skel { min-width: 0; height: 192px; border: 1px solid var(--dm-line); border-radius: 16px; background: linear-gradient(100deg, var(--dm-soft) 30%, color-mix(in srgb, CanvasText 9%, Canvas) 45%, var(--dm-soft) 60%); background-size: 250% 100%; animation: dm-shimmer 2s ease-in-out infinite; }
.dm-mask { position: fixed; inset: 0; z-index: 70; background: rgb(16 20 32 / 32%); animation: dm-fade .16s ease-out; }
.dm-detail { position: fixed; inset: 0 0 0 auto; z-index: 71; display: flex; flex-direction: column; gap: 24px; width: 440px; max-width: 100vw; min-width: 0; padding: 24px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; scroll-padding-top: 112px; border-left: 1px solid var(--dm-line); background: var(--dm-bg) !important; color: var(--dm-text); box-shadow: -16px 0 64px rgb(16 20 32 / 16%); animation: dm-slide .2s ease-out; }
.dm-detail > * { flex-shrink: 0; min-width: 0; }
.dm-detail-head { position: sticky; top: -24px; z-index: 3; display: flex; align-items: center; gap: 12px; margin: -24px -24px 0; padding: 24px; border-bottom: 1px solid var(--dm-line); background: var(--dm-bg); }
.dm-detail-head .dm-thumb { width: 52px; height: 52px; border-radius: 14px; font-size: 22px; }
.dm-detail h2 { margin: 0; color: var(--dm-text); font-size: 17px; font-weight: 650; line-height: 1.5; overflow-wrap: anywhere; }
.dm-close { display: grid; place-items: center; flex: 0 0 34px; width: 34px; height: 34px; margin-left: auto; padding: 0; border: 1px solid var(--dm-line); border-radius: 10px; background: var(--dm-soft); color: var(--dm-text); font-size: 23px; line-height: 1; cursor: pointer; transition: background .16s ease; }
.dm-close:hover { background: var(--dm-tint); }
.dm-detail-desc { margin: 0; color: var(--dm-muted); font-size: 13px; line-height: 1.9; white-space: pre-wrap; overflow-wrap: anywhere; }
.dm-detail-rows { display: flex; flex-direction: column; gap: 0; padding: 4px 0; border-top: 1px solid var(--dm-line); border-bottom: 1px solid var(--dm-line); font-size: 12px; }
.dm-detail-row { display: flex; align-items: baseline; gap: 16px; min-width: 0; padding: 9px 0; line-height: 1.7; }
.dm-detail-row > span:first-child { flex: 0 0 52px; color: var(--dm-muted); }
.dm-detail-row > :last-child { min-width: 0; overflow-wrap: anywhere; }
.dm-detail-row a { color: var(--dm-ink); text-decoration: none; text-underline-offset: 3px; }
.dm-detail-row a:hover { text-decoration: underline; }
.dm-versions { display: flex; flex-direction: column; gap: 6px; max-height: none; overflow: visible; }
.dm-version { display: flex; justify-content: space-between; gap: 14px; min-width: 0; padding: 10px 12px; border: 1px solid transparent; border-radius: 8px; background: var(--dm-soft); color: var(--dm-text); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.dm-version:first-child { border-color: color-mix(in srgb, var(--dm-accent) 20%, Canvas); background: var(--dm-tint); }
.dm-version span { min-width: 0; overflow-wrap: anywhere; }
.dm-version em { flex: none; color: var(--dm-muted); font-style: normal; }
.dm-detail-foot { position: sticky; bottom: -24px; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: auto -24px -24px; padding: 18px 24px max(18px, env(safe-area-inset-bottom)); border-top: 1px solid var(--dm-line); background: var(--dm-bg); }
.dm-detail-foot .dm-btn { min-width: 92px; min-height: 40px; }
.dm-toast { position: fixed; right: 24px; bottom: 24px; z-index: 90; display: flex; align-items: center; gap: 14px; max-width: min(440px, calc(100vw - 32px)); padding: 14px 16px; border: 1px solid var(--dm-line); border-radius: 13px; background: var(--dm-bg); color: var(--dm-text); box-shadow: 0 12px 40px rgb(16 20 32 / 18%); font-size: 12px; animation: dm-rise .18s ease-out; }
.dm-toast > span { min-width: 0; overflow-wrap: anywhere; }
.dm-toast--error { border-left: 3px solid color-mix(in srgb, #db5050 65%, CanvasText); }
.dm-toast button { display: grid; place-items: center; flex: 0 0 28px; width: 28px; height: 28px; padding: 0; border: 0; border-radius: 7px; background: var(--dm-soft); color: var(--dm-text); font-size: 18px; cursor: pointer; }
.dm-bgpop { position: absolute; top: calc(100% + 10px); right: 0; z-index: 40; display: flex; flex-direction: column; gap: 13px; width: 280px; max-width: calc(100vw - 32px); padding: 18px; border: 1px solid var(--dm-line); border-radius: 14px; background: var(--dm-bg); color: var(--dm-text); box-shadow: 0 12px 36px rgb(16 20 32 / 14%); }
.dm-bgpop-label { color: var(--dm-muted); font-size: 11px; font-weight: 600; }
.dm-swatches { display: flex; gap: 10px; padding: 3px; }
.dm-swatch { width: 34px; height: 34px; padding: 0; border: 1px solid var(--dm-line); border-radius: 9px; cursor: pointer; }
.dm-swatch[aria-pressed="true"] { outline: 2px solid var(--dm-ink); outline-offset: 3px; }
.dm-swatch--aurora { background: linear-gradient(135deg, #4d6bfe, #a78bfa); }
.dm-swatch--paper { background: linear-gradient(135deg, #edbf8a, #e99898); }
.dm-swatch--mint { background: linear-gradient(135deg, #65c9b1, #81b8e8); }
.dm-swatch--none { background: repeating-linear-gradient(45deg, var(--dm-soft) 0 5px, var(--dm-line) 5px 10px); }
.dm-bgrow { display: flex; gap: 8px; min-width: 0; }
.dm-bgpop input { width: 100%; min-height: 36px; padding: 7px 10px; font-size: 12px; }
.dm-bgrow button { flex: none; }
.dm-root[data-bg="paper"] { background: radial-gradient(ellipse 85% 280px at 15% 0, rgb(225 160 105 / 10%), transparent 80%), var(--dm-bg); }
.dm-root[data-bg="mint"] { background: radial-gradient(ellipse 85% 280px at 15% 0, rgb(60 180 155 / 9%), transparent 80%), var(--dm-bg); }
.dm-root[data-bg="none"] { background: var(--dm-bg); }
.dm-page { height: 100%; min-width: 0; overflow: auto; }
.dm-page .dm-root { height: auto; min-height: 100%; overflow: visible; }
.dm-appear { animation: dm-rise .2s ease-out backwards; animation-delay: 0ms !important; }
@keyframes dm-rise { from { opacity: 0; } to { opacity: 1; } }
@keyframes dm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes dm-slide { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes dm-shimmer { from { background-position: 150% 0; } to { background-position: -100% 0; } }
@media (max-width: 999px) {
  .dm-root { padding: 28px 24px 48px; }
  .dm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dm-hero-card { align-items: flex-start; flex-direction: column; gap: 16px; padding: 20px; }
  .dm-hero-main { width: 100%; }
  .dm-hero-side { align-self: flex-end; }
}
@media (max-width: 600px) {
  .dm-root { gap: 20px; padding: 24px 16px 40px; }
  .dm-hero { flex-wrap: wrap; gap: 16px; }
  .dm-hero h1 { font-size: 25px; }
  .dm-hero > div:last-child { margin-left: auto; }
  .dm-tools { gap: 8px; }
  .dm-select { max-width: 42%; padding-inline: 8px; }
  .dm-chips { gap: 7px; padding-bottom: 16px; }
  .dm-chip { padding-inline: 9px; }
  .dm-grid, .dm-featured { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .dm-card { min-height: 180px; padding: 18px; }
  .dm-hero-card { min-height: 0; }
  .dm-detail { padding: 20px; }
  .dm-detail-head { top: -20px; margin: -20px -20px 0; padding: 20px; }
  .dm-detail-foot { bottom: -20px; margin: auto -20px -20px; padding-inline: 20px; }
  .dm-toast { right: 16px; bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .dm-root *, .dm-root *::before, .dm-root *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
@media (forced-colors: active) {
  .dm-card[aria-current="true"], .dm-hero-card[aria-current="true"], .dm-chip[aria-pressed="true"] { outline: 2px solid Highlight; outline-offset: -2px; }
  .dm-mask { background: CanvasText; opacity: .35; }
}
`
