# Saku → Lily’s Fun World · audit & staged implementation

**Audit basis:** the supplied `monmegbeta-main.zip`, prior `Saku-Cinnamoroll-Updated.zip`, user-supplied 14 new transparent sticker sources, and the HTML/CSS/JS from the working archive. The original Google Sheets source was not changed.

## Stage 0 · baseline audit

| Existing area | Observed behavior | Risk or friction |
|---|---|---|
| Visual hierarchy | Welcome banner → moon/mood → oversized spending headline | Income, savings and remaining flow were pushed below the first screen, especially on phones |
| Quick note chips | Each click prefixed text (`Transport · Makan`) | Selecting a new shortcut duplicated categories instead of changing the value |
| Transactions | Search, type filter, collapse, CSV export | No sort or easy row-copy; edit/update route does not exist in original backend |
| Budget | Fixed keyword-based categories and limits | Unmatched spending was excluded from budget totals without its own breakdown |
| Chart | Nonzero minimum bars even for zero-expense days | Risk of implying activity in empty periods |
| Savings scene | Real `Tabungan` amount with optional locally stored goal | Needed data-unavailable labeling and more compact placement |
| Sync | Fetch success / failure chip and opaque `no-cors` POST | No last-read timestamp, persistent unconfirmed write count, or specific profile error |
| Stickers | 14-tile collection inside long dashboard plus Cinna companion | Gallery displaced money tools; opportunity for stickers throughout functional UI |
| Accessibility | Native form labels, dialogs, skip link, focus and reduced-motion basics | Small targets, focus flow through new floating menu, dense mobile controls |

## Stage 1 · facts before decoration

Added four totals at the top. Net uses actual `Pemasukan - Pengeluaran - Tabungan`; longer-history net is explicitly called cash flow, **not a bank balance**. No content is invented when feeds fail. Reduced the hero and mood selector.

## Stage 2 · information and action

Daily chart now makes zero/loading/error states explicit; no fake 3% bars. Added true category breakdown with *Lainnya*, readable budget tracks, transaction sorting and filter-aligned CSV export. Each row can be copied. Preserved history collapsing and the original append-only write form.

## Stage 3 · Lily’s sky and stickers

All 18 supplied character assets are reused outside the gallery. The gallery itself moved to a dedicated page and its former location became a compact three-sticker invitation. Added Cinna’s actual action menu and feedback, a smaller letter/hero, tiny animation on art, day/night toggle, and reduced-motion behavior. The branding now says **Lily’s fun world**.

## Stage 4 · sync truth and guardrails

Surfaces last successful CSV read, each profile’s read error and pending unconfirmed writes. Persists up to 20 unresolved reminders per browser. Verification requires an increased count of a matching transaction in the downloaded feed; a successful `no-cors` fetch alone is never treated as confirmation. Manual local reminder dismissal never alters the Sheet. Original feed URLs and Apps Script were retained.

## Verification and known limits

- **Static:** `node --check script.js` and `node --test tests/data.test.cjs`.
- **Responsive:** isolated Chromium, screenshots and no horizontal overflow at 320px, 390px, 768px, 1440px. Tests include keyboard-friendly dialogs and menu, transaction input chips, collapse, search/type/sort, category and total computations, and separate gallery modal.
- **Data:** synthetic data used **only within testing**, not deployed. Example test expectations: Rp 200,000 income; Rp 59,000 expense; Rp 20,000 saved; Rp 121,000 cash flow.
- **Not live-tested:** authenticated Google Sheets editing (not supported by original backend), actual published CSV lag, network failures from a deployed origin, and real write verification to the owner’s spreadsheet. Test any actual financial write on the real deployment before relying on it.

**Unresolved upstream dependency:** to support real editing/deleting from the browser, add an authenticated update/delete endpoint and stable unique transaction IDs. Recreating an old transaction by posting another would duplicate money data; intentionally not implemented.


## Post-screenshot repair audit, 9 November 2026

### Findings and treatment
1. **High:** The mobile header had three icon-only controls with ambiguous intent. **Fixed:** only labeled Stiker remains; sync and refresh are combined below.
2. **High:** Companion and Catat floated at the two lower corners, obscuring content and competing with the footer. **Fixed:** companion is inline and menu popovers locally; Catat is a stable dock action.
3. **High:** Night-sky logo remained blue against navy. **Fixed:** high-contrast white logo and nav links in night mode.
4. **Medium:** Mobile scrolling demanded repeated hunting for transactions and saving goals. **Fixed:** real anchor navigation for Beranda, Riwayat and Tabungan/Budget, safe-area-aware and keyboard accessible.
5. **Medium:** Daily chart had unclear exact values on touch. **Fixed:** select-a-day text with live Rupiah value and arrow-key support, real date labels.
6. **Low:** Components had competing shadows, lots of dashed outlines, and over-small metadata. **Fixed:** harmonized borders, compacted header, and increased important labels/targets.

### Verification checklist
Automated browser smoke tests use a mocked published Google Sheets CSV; no production transactions were created. Checked widths 320, 390, 768 and 1440, correct income / expenses / savings / remaining cash flow, zero horizontal overflow, chart interaction, keyboard arrows, functional dock and popup controls, shortcut replacement, Nopal profile adaptation, day/night toggle, and 14 sticker dialogs. `tests/data.test.cjs` covers the parsing/sums independently. Live Sheets write success remains unverified and the existing backend is append-only.
