# anti-slop design review

Source reviewed: https://github.com/miqdadbadjuber/anti-slop (core rulebook, craftsmanship standard, design dials, and delivery gate). The rulebook is used as a **design and QA filter**, not as a runtime JavaScript dependency. `DESIGN.md` contains the project-specific visual direction, as the repo recommends.

## Delivery gate

**1. Hard gate: PASS on tested states.** No invented figures or fake testimonials. The original balances, budget limits, CSV export, and Google Sheets connections were preserved. All four mood choices update text, all 12 sticker tiles open and close an accessible native dialog, and profile / month / form actions are wired. Every source image is bundled locally. No horizontal overflow or broken character art in the tested viewports. Focus styles and reduced-motion rules are present. The live Google backend was not exercised here.

**2. Purpose gate: PASS.** The blue sky follows Cinnamoroll's theme; the blush accent follows the cheeks; white panels protect financial legibility; stickers belong to the user's supplied collection rather than generic AI iconography. A separate sticker-book section preserves usability instead of cluttering the transaction list.

**3. Liveliness: PASS.** ENERGY 3 / RHYTHM 3 / MOTION 1. The large character hero, selectable moods, and varied sticker tiles feel expressive without imposing constant ambient motion on a finance tool.

**4. Craftsmanship and quality: PASS for local simulated-data rendering.** Browser-based checks at 320, 390, 768, and 1440 px found no layout overflow, broken images, or JavaScript page errors; the Lily/Nopal theme swap and key dialogs worked. The test injected synthetic CSV rows so **these checks do not confirm the real Sheets feed, Apps Script writes, or cross-origin behavior**.

## Outstanding deployment considerations

- The frontend includes URLs for publicly published financial CSV feeds. Use private or authenticated data delivery before deploying a sensitive personal finance dashboard publicly.
- The inherited cross-origin `no-cors` POST cannot confirm successful insertion into Sheets. The app deliberately tells users to check their Sheet before repeating a submission.
- Cinnamoroll is Sanrio IP. The images were provided for this customization; that alone does not license public or commercial redistribution. Check authorization before public deployment.
- Google Fonts require a network connection; the CSS specifies system fallbacks.

For future edits, follow the source repo's installer guidance: `npx antislop-ai`. This package does not claim to have installed the npm agent plugin.

---

## Interactive edition review (2026-11-09)

Reference: https://github.com/miqdadbadjuber/anti-slop and its core `antislop.md` (read as public reference; no package installed).

| Gate | Result | Evidence |
|---|---|---|
| Intentionality | PASS | Hero drift says "sky"; stars track real savings; particles only signal direct interaction/confirmed history. |
| Functional completeness | PASS for mocked UI | Goal form, mood, toggle, letter, companion, chips, profile switch exercised in the browser. |
| Content-driven composition | PASS | Only one savings scene added near the finance summary; existing 12-sticker gallery remains, no extra unlock UI. |
| Responsive resilience | PASS for sizes tested | 320/390/768/1440px: no horizontal scroll or missing visible images. |
| Evidence | PASS with caveat | Savings stars are based on `Tabungan` records; unverified writes never trigger a false success celebration. Live Sheets API was not authenticated or exercised. |
| Interaction and focus | PASS in implemented features | Native buttons, forms and dialogs; descriptions and accessible names; reduced-motion media query. |
| Real data security | NOT CLAIMED | Existing published CSV endpoints remain public and anonymous Apps Script writes remain. Harden before putting real personal finance data on a public site. |
| Long-duration animation | PASS with caveat | CSS-only transform/opacity effects and reduced-motion support; user can disable motion through OS preferences. |

**Delivery gate:** UI/structure PASS; copy PASS; code PASS for client interactions with mocked data; live backend integration UNVERIFIED. No claim of a production security audit.
