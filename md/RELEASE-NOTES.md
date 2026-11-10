# Lily’s Fun World — release notes

**2026-11-09:** Redesigned the existing Saku journal into a more legible, mobile-first, Cinnamoroll-overflowing *Lily’s Fun World*.

- Finance-first monthly 4-card summary, empty-aware daily graph, category breakdown, budget/savings progress.
- Search, category, chronological/amount sorting, collapse, row copy and filtered CSV download.
- Fixed additive shortcut bug: each category now replaces the note value.
- Compact welcome banner/mood selector, working inline Cinna action menu, 18 assets throughout UI.
- Sticker gallery moved to `stickers.html`; dashboard preview remains compact.
- Clearly labeled successful CSV fetch timestamp, per-profile read failure and unconfirmed POSTs; local reminder dismissal after manual checking.
- Alternate Nopal dark theme and original Google Sheets integrations retained.
- Separate `redesign.css` and `polish.css` make it easy to distinguish the redesign from the original theme stylesheet.

See `DESIGN.md` (anti-slop design contract), `AUDIT.md` (baseline findings, test coverage), and `README.md` (deploy, integration limitations).

## Polished navigation and control positioning
- Removed icon-only header crowding. Sticker World remains labeled and refresh is inside an explicit Sheet-read status strip.
- Added bottom dock at tablet and mobile sizes, with safe-area padding, accessible section links and a separate Catat button. The alternate Nopal profile switches the savings link to its actual budget section.
- Moved Cinna companion from a fixed lower-left overlay into the sky toolbar, preserving every magic-menu action.
- Ensured night-sky brand and controls remain legible; added exact daily spending chart selection by touch and keyboard, without drawing pretend spending bars on zero days.
- Reference checks: Monzo, YNAB, Material navigation, Apple tab-bar guidance and anti-slop. iFixAi intentionally not run without an agent to audit.

## Cinnamoroll Add Transaction + spacing refresh (9 November 2026)

- Mobile Catat now **is a transparent, tappable Cinnamoroll sticker**, centrally anchored in an inset bottom dock; Beranda/Riwayat/Tabungan stay labeled and clickable.
- Gallery's Catat sticker returns to the original transaction form via a one-use query flag.
- Desktop Catat and the companion's little-magic menu also offer a Cinna entry point. Nopal retains a regular plus.
- Panels, controls, gaps, border radii and shadows use a consistent visual scale; the narrow-screen transaction dialog has a smaller, aligned mascot and readable single-line heading.
- All Google Sheets read/write endpoints and financial logic are unchanged.
- Final code layer `finishing.css` is deliberately separated from older styles to simplify rollback and future refinement.

## Masthead, gaps & dock alignment (9 November 2026 — latest)

- Replaced the cramped stacked header with a Saku-*style* `Lily’s.` masthead, beside transparent Cinna art, a fine divider, and the readable `little sky journal` subtitle. The old `Saku` name does **not** appear in the UI.
- Kept the header and Sheets status edges aligned, including a readable high-contrast light masthead in night-sky mode.
- Normalized the spacing between monthly totals, Cinna banner, sky controls and mood picker to a 8/12/16px rhythm; eliminated floating decorative assets that crossed the banner edge on narrow screens.
- Aligned the Day/Night and companion buttons to matching 44px controls on phones.
- Adjusted the fixed bottom dock and its tappable Cinna action so the sticker is centered, with a smaller and consistent lift; preserved the actual transaction form trigger.
- Fixed profile-switching JavaScript to target the new masthead, retaining Nopal’s alternate branding and accessible labels.
- No changes to Google Sheets feed URLs, write API, calculations or asset filenames.

Browser checks (isolated, test-only CSV): 320/390/768/1440px, no horizontal scrolling or browser JS errors; Lily/Nopal switching, Catat modal, note shortcut replacement, Cinna companion action and gallery render.
Node data tests: 5/5 pass. Google Sheets production reads/writes were **not** tested.
