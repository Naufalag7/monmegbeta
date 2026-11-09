# Cinna-first QA — 9 November 2026

## Actual tests completed in this environment

- Playwright / headless Chromium, **in-memory document** with local CSS, images inlined and a mocked CSV `fetch` (the sandbox blocks browser navigation to local and external URLs): **320px, 390px, 768px, 1440px**.
- `document.documentElement.scrollWidth <= innerWidth` at all four widths. Mobile dock visible at ≤735px, absent at 768px and 1440px. The centered mascot image is not hidden at 320/390px.
- Cinna tap opens the existing `#entry-dialog`, and dialog close works.
- Two different note chips leave only the latest selection (`Makan` then `Transport` → `Transport`).
- Cinna companion menu → Catat opens the same dialog.
- Switching to Nopal preserves Add Transaction behavior; desktop header Add Transaction opens the same dialog.
- No uncaught JavaScript errors during four-width smoke tests.
- `node --test tests/data.test.cjs`: **5 passed** (CSV parsing, dates, monetary input, profile isolation, empty feed); `node --check` passes on the JS files.

## Not proven in this isolated test

- The real Google Sheets POST outcome (the existing `no-cors` endpoint cannot confirm writes). Test one genuine transaction on your deployed site and verify its published CSV row.
- Cross-page browser navigation from the sticker gallery, since local/external navigation is blocked here. The gallery has a real `href="index.html?catat=1"` and the journal handles and clears that query before opening the form.
- Actual mobile-device keyboard, safe-area inset, and assistive-technology behavior beyond native HTML semantics and headless keyboard/click tests.

Preview fixtures are test-only; the delivered HTML and JS contain no fake activity.
