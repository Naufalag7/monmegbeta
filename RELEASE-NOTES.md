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
