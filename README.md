# Saku: Lily's Cinnamoroll sky journal

A Cinnamoroll-filled redesign of the uploaded finance-tracker frontend. It preserves the Lily/Nopal profiles, monthly overview, transaction search and CSV export, budget categories, Google Sheets CSV read, and the existing Apps Script transaction submission.

## What's inside

- `index.html`, `style.css`, `script.js`: the ready-to-use website; no build system required.
- `assets/stickers/`: **all 17 user-provided images**, converted to portable WebP or optimized JPEG with clear filenames. The 12 white-background drawings are showcased on a clickable sticker wall. The four transparent PNGs are used for expressive mood choices and other UI accents. The winter artwork appears in a postcard.
- `assets/saku-nopal-icon.svg`: a minimal non-character icon for the unchanged Nopal theme.
- `DESIGN.md`: the intended visual direction, component rationale, and anti-slop liveliness dials.
- `ANTI-SLOP-REVIEW.md`: the delivery check based on [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop).

## Open the site

1. Extract the ZIP, preserving all files and the `assets/stickers/` directory.
2. Open `index.html` in a browser. If your browser blocks local fetches from a `file://` page, serve this directory with a small local web server such as `python -m http.server 8000` and open `http://localhost:8000`.
3. For the existing GitHub Pages deployment, replace the website's root `index.html`, `style.css`, `script.js` and upload `assets/`. Keep the CSS and asset paths unchanged.
4. After deployment, test the Lily and Nopal profiles and confirm Google Sheets data appears. Check submissions in the actual Sheet: the existing backend does not provide verifiable write confirmation.

**Theme behavior:** All new mood and scrapbook UI is Lily-only. Switching to Nopal retains the original dark money-tracker look. The mood selector changes only the friendly on-page message, not your financial data.

**Compatibility:** All artwork loads locally; only Google Fonts and the existing finance backend require internet access. CSS and JavaScript remain plain browser-native code.

## Safety, rights, and limitations

The pre-existing frontend reads published Google Sheets CSV URLs. Do not put sensitive real finance data on a public page without a secured backend. Its `no-cors` POST cannot verify write success; don't resend without checking Sheets first.

Cinnamoroll is a Sanrio character. These user-provided images are bundled for the requested personal customization, not licensed by this project for public or commercial distribution. See Sanrio's published guidance if deploying publicly: https://sanrioinccustomercare.zendesk.com/hc/en-us/articles/1260804384909-Can-I-use-your-characters-on-my-homepage-or-a-custom-item

## Tests performed

Ran Chromium-based inline-page render tests using simulated CSV data for viewports **320, 390, 768, and 1440 pixels**. Checked no broken images, no page JavaScript errors, no horizontal scroll overflow, and functional mood, gallery dialog, profile switch, and transaction dialog. Live Google endpoints were not tested. The preview screenshots supplied separately depict synthetic data and should not be taken as real figures.

## New: interactive Cinna sky (v2)

See `RELEASE-NOTES.md` for the new floating companion, savings cloud, nighttime theme, letter, transaction shortcuts, and animations. The optional star goal is stored in this device's browser; the actual savings amount comes from the selected month's `Tabungan` entries. The previous sticker viewer stays, but there is **no unlockable sticker-diary feature**. All user-supplied artwork remains in `assets/stickers/`.

The original published Sheets feeds and `no-cors` Apps Script behavior are retained. Writes are not guaranteed by the POST response. Do not resend without checking Sheets. This is still an unofficial Sanrio fan customization.
