# Lily’s Fun World ☁

A playful, responsive, Cinnamoroll-inspired personal finance journal. This redesign continues the existing *Saku* codebase, **without changing the Google Sheets CSV feeds or Apps Script POST endpoint**.

## Run

Open `index.html` via a static host (GitHub Pages, Netlify, or any HTTPS static server). Keep `style.css`, `redesign.css`, `polish.css`, `script.js`, `experience.js`, `stickers.html`, `stickers.js` and `assets/` together at the root. The links between the journal and sticker world are relative.

You can preview locally with:

```sh
python -m http.server 8000
# visit http://localhost:8000
```

The site is plain HTML, CSS, and JavaScript—no build step, npm install, or server-side credentials needed. Google Fonts are optional and have system fallbacks.

## What's new

- Four first-screen monthly money cards: income, expenses, savings and remaining cash flow, calculated from Sheet rows.
- More compact warm greeting, hero and mood controls. No `saku.` logo in the corner.
- Daily spending chart with real-zero and unavailable-data states; tap or use arrow keys for an exact daily amount.
- Monthly budget bars plus **category breakdown**, including unmatched spending in *Lainnya*.
- Separate `stickers.html` gallery; **all 18 provided sticker assets** also appear somewhere in the dashboard experience.
- Functional inline Cinna mini-menu with hug, letter, sky switch and sticker navigation.
- Bug fix: tapping note shortcut *replaces* the previous category and marks only one selected chip.
- Collapsible transaction history, search, type filter, newest/oldest/largest sort, copy details and filtered CSV export.
- Fixed mobile bottom navigation for summary, history, savings (or Nopal budget), and a dedicated Catat action. Refresh now belongs to the sync banner and no button floats over the footer.
- Clear feed-read status, last successful fetch time, source error, pending writes; unresolved writes survive a refresh. **Sudah dicek** clears only a *local reminder*, after confirmation—not Sheet records.
- More readable form sizes and focus rings, accessible dialogs, reduced-motion support and 320px+ responsive layouts.

## Data and backend limitations

The app uses the **original published CSVs** for Lily and Nopal and the **original append-only Apps Script** for sending new transactions. All totals, charts, category allocations and history are computed from the currently downloaded rows. The dashboard intentionally ships with **no demo transactions**. While data is loading or inaccessible, it shows `—` and honest explanatory states, not fabricated zeros.

**Existing transactions cannot be edited or deleted by this frontend.** The current integration provides only append, no verified update/delete route or durable Sheet row identifier. To correct older transactions, edit the Google Sheet source directly with a Google account that has access, then press the refresh icon. The *Cara ubah transaksi?* control explains this, while *Salin* helps locate a row. If you later add a proper update API with stable row IDs, it can be integrated without faking edit support.

**POST results are not proof of success.** Apps Script is called with `mode: 'no-cors'`, which makes the response opaque. New writes are marked as **unconfirmed**, then matched against the published CSV on subsequent refreshes. The publication can lag. Avoid retrying until you've checked the original Sheet. If the sheet cannot be fetched, old cached session data is retained, with a visible error. The displayed timestamp is the browser's last successful **fetch**, not the Sheet's modification time.

Local preferences and pending-write reminders are stored via `localStorage` and are not synced across devices. Monthly savings target is a personal browser preference, not a Sheets transaction.

## Quality checks

Read `DESIGN.md`, `AUDIT.md` and `DELIVERY-GATE.md` for the design rationale and evidence-based anti-slop checks. `tests/data.test.cjs` contains deterministic tests of CSV parsing, amounts, date handling, row classification and cash-flow math; run with:

```sh
node --test tests/data.test.cjs
```

Browser-based checks were run using an isolated page with **synthetic test-only rows**, because the sandbox blocks navigation to localhost and local files. They validate the front-end behavior but **do not verify the live Google Sheets service or real writes**. Test rows are not in the shipped app.

## Licensing note

Cinnamoroll is a character of Sanrio. This is an unofficial personal fan design. Owning a downloaded transparent image is not the same as holding commercial usage rights.

### Cinna-first Add Transaction (latest revision)

On mobile, tap the center **Cinnamoroll sticker / Catat** action to open the same transaction form used on desktop. The sticker is also in the desktop Add Transaction control and in Cinna's companion menu. From `stickers.html`, its dock shortcut returns to `index.html?catat=1` and opens the form automatically; the one-time parameter is cleared.

The latest masthead, spacing and bottom-dock fixes are in `finishing.css`. Keep the stylesheet order `style.css` → `redesign.css` → `polish.css` → `finishing.css` in both pages. You can change the mascot art via `assets/stickers/cheer.webp` in the two dock elements; do not change their IDs or form event bindings. Google Sheets URLs are unchanged.


## Latest alignment fix

The visible header now reads **Lily’s.** beside a transparent Cinnamoroll sticker and the small **little sky journal** caption. The status strip, hero-to-toolbar spacing, and bottom dock have been realigned for phone widths. `script.js` was updated for profile switching; please deploy it together with both HTML pages and `finishing.css`. For the exact checks see `QA-LAYOUT.md`.
