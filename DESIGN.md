# Lily’s Fun World — Design language (anti-slop filter)

**Edition:** November 2026 · responsive journal redesign  
**Nature:** A *personal* finance journal inside a Cinnamoroll-inspired cloud world. Not a productivity SaaS, sales funnel, leaderboard, or fake virtual bank.

## One-sentence intent

Lily should immediately know what came in, what went out, what she set aside, and what remains this month—then feel like a tiny fluffy friend is celebrating the ordinary work of keeping track.

## Identity and visual vocabulary

- **Personality:** handmade love note × sky journal × stickers on stationery. Sweet without hiding facts.
- **Primary colors:** powder sky `#e9f7ff`, soft paper `#fffefa`, blue ink `#275b7b` and readable action blue `#2e81ae`.
- **Accent:** Cinna cheek rose `#a94777`; used sparingly for special moments and spending.
- **Supporting:** sea-glass income, lavender savings, blue cash-flow. Meaning wins over decoration; negatives remain visually distinct and explicitly signed.
- **Type:** Fredoka on warm headings/featured figures, Nunito on metadata/inputs/controls. System fallbacks keep reading usable if web fonts cannot load.
- **Shapes:** cloud-ish curved banners, pill date controls, soft rounded receipt cards, dotted/scrapbook borders, restrained tape and hearts. No glass-morphism blur behind money values.
- **Illustrations:** all 18 provided transparent stickers appear in functional or decorative contexts on the dashboard (budget category icons, money cards, saving scene, hero, mood, companion, status, and empty states). The 14-item gallery lives separately at `stickers.html`.
- **Nopal:** a separate, calmer dark profile remains available. Lily-specific illustrations and extra scenes are hidden in Nopal mode.

## Information hierarchy

1. **Brand and clearly worded sync status.** The header masthead says *Lily’s.* with *little sky journal*, not *Saku*. Connection detail follows the top bar, including timestamp of most recent successful CSV fetch and number of unconfirmed POSTs.
2. **Greeting + profile switch.** Little emotional note, not a big hero.
3. **Four factual monthly totals first:** income, expenses, saved, and net cash flow. Net = income − expenses − savings. The longer-history net is labeled as **cash flow, not account balance**.
4. **Daily spending chart** sourced entirely from actual dated expenses. Real zero/empty/loading/error treatments; no random bar heights or fictional events.
5. **A miniature Cinna moment:** compact mail/hero, day/night toggle, and one-row mood control.
6. **Action panels:** transaction history with search, type and order filters, transparent CSV export, and category budgets/breakdown. Unclassified expenses go to *Lainnya*, not nowhere.
7. **Savings goal:** actual current-month `Tabungan` entries / *locally configured* goal. No invented targets or earned stars until progress is real.
8. **Separate sticker page** with a three-sticker preview on the dashboard. Fun stays accessible without burying money information.

## Animation dials

ENERGY **4** (many affectionate stickers) / RHYTHM **3** (alternating compact data and scrapbook scenes) / MOTION **2** (floating *art*, still numbers and controls).

- Artwork can softly bob, drift and wiggle. It must never change balances or steal focus.
- User-triggered interactions have brief, bounded feedback: note chip selection, Cinna hugs, mail popups, Cinna menu.
- Cinna lives inside the sky toolbar with a real menu: hug, letter, day/night sky, sticker world. The mascot cannot block transactions or the footer. On small screens, the bottom dock holds three real section links and one visually distinct Catat action.
- Never autoplay music, spawn persistent particle loops or throw a blocking animation over a transaction field.
- Respect `prefers-reduced-motion`; targets do not move under a finger and there is no background scroll-jacking.

## Anti-slop delivery gates

**Hard gates (must pass)**

- Never substitute fake totals or fake activity when Sheet data is unavailable. Render `—`, loading or error, with an explanation.
- Every button does real work. If Sheets edit/delete API does not exist, clearly describe the limitation instead of displaying an imitation Edit action.
- Search/filter/sort/export must use the currently selected profile and month. CSV export respects the current filters.
- All core actions remain keyboard operable, with visible focus, real labels, and native dialog/escape behavior. Floating menu moves keyboard focus into its actions when opened.
- Layout must not horizontally scroll at **320, 390, 768, and 1440px**. Finance text stays readable in all four.
- Error, stale data, and unconfirmed writes are visibly distinct from verified CSV reads.

**Purpose gates**

- Decorative stickers do not cover buttons or the balance figures, and are dropped on narrow screens where they overflow.
- Micro-animation only where it adds delight or communicates a state. Day/night mode does not compromise card contrast.
- The unusual pastel palette and mixed Indonesian/English notes are purposeful echoes of Lily’s original journal, not generic AI copy.

**Quality locks**

- Money values are tabular, naturally broken on narrow screens, explicitly scoped to the selected month and profile.
- Each budget category uses the original configured Rupiah limit. Category classification is keyword-based and labeled as such; unknown expenses appear as *Lainnya*.
- No external UI framework, large animation runtime, fake social proof, gradient-stock hero, or third-party asset CDN.
- Character art is fan art of © Sanrio Cinnamoroll. A personal project does **not** imply official affiliation or an unrestricted commercial license.

## What the interface cannot claim

The current Apps Script accepts append-only, cross-origin `no-cors` POST requests. An opaque browser result cannot prove a write succeeded. The interface therefore says **sent / awaiting verification**, only counts a write as seen when the published CSV contains an additional matching row, and persists the unresolved reminder locally. Updating or removing an old row needs Sheet access or a backend endpoint that supports edits; there is no fake edit form.

`Diambil` is the time **this browser fetched the CSV**, not Google Sheets’ actual modification timestamp. Goals, mood, sky and collapsed-history preferences are per browser, not cloud-synced.

## November 9 polish pass: phone-first control architecture

- **Reason for change:** the old header became three tiny unrelated circles on small screens. Refreshing a feed should look like part of feed status, not an unlabeled neighboring action. The floating Cinna and form CTA also obscured the lower page.
- **At 736px and below:** a stable, safe-area-aware dock exposes Beranda, Riwayat, Tabungan/alternate-profile Budget, plus a distinctly styled Catat transaction action. Sticker World remains a labeled header destination and a feature card. Destinations are scroll anchors in the existing page, not fake routes.
- **At desktop:** a light top navigation can link to the same sections, while the existing primary transaction action stays in the header.
- **Sync:** status, last local fetch time, pending/unconfirmed write count, errors, and refresh now form one coherent strip with the refresh control always at the right edge. A green dot is supplementary, never the only status message.
- **Charts:** day 01 / mid-month / final day are explicit; tapping a day gives the real amount; keyboard left/right/home/end updates an announced value; bars use actual transactions only. No invented Y-scale metrics.
- **Animation:** a few sticker bobs remain, but no continuously floating action controls. The fixed dock does not bounce or compete with data.
- **Night theme:** logo, secondary labels and navigation links are recolored to remain legible against navy.
- **Reference inspirations:** Monzo's balance-first hierarchy; YNAB's Home/Spending/goal grouping and quick-add; Apple's labeled tab navigation; Material's 3–5 destinations on compact displays. We kept Saku's scrapbook identity rather than copying a bank UI.
- **anti-slop delivery filter:** real controls, real data, explicit errors, phone layouts without horizontal overflow, visible focus and reduced motion. `iFixAi` was reviewed but is intentionally not used: there is no AI agent in this website.

## November 9 — Cinna-first transaction action and shape cleanup

- **Core affection:** The transparent `cheer.webp` sticker **is** the Add Transaction button on compact screens. Its fixed, centered hit area is 64px high with a visible **Catat** label; the art floats only visually, never as a moving click target. The action opens the existing native transaction dialog and sends to the same Apps Script; no parallel forms or simulated writes.
- **One dock layout:** On the journal page: Beranda · Riwayat · **Cinna/Catat** · Tabungan (Budget for Nopal). On the sticker page: Beranda · Riwayat · **Cinna/Catat** · Stiker. The sticker-page action links back to the journal with a one-shot `?catat=1` parameter to open the real form, then removes the parameter.
- **Secondary path:** The desktop transaction button has a visible sticker. The Cinna companion's *Catat transaksi ♡* item is another working entry point.
- **Spacing and shape scale:** 6/10/16/22px spacing, 23px section-card corners, 16px inner-card corners, ~13px control corners, simplified soft shadows. Narrow cards use matching 20px corners instead of mixing arbitrary shapes. The two right-column panels are separated by the same 16px gap as the next section.
- **Native accessibility:** The mascot button remains a real labeled `<button>` (on the journal), a real deep-link `<a>` (in the gallery), keyboard-focusable and ≥44px. Nopal uses the original conventional plus glyph and an accurate accessible label. Respect reduced motion and safe-area insets.
- **Controls never collide:** The bottom dock is inset and includes footer scroll clearance. The entry dialog art is smaller and aligned beside the heading; title, form fields, and submit/cancel are legible at 320px.
- **Limitations unchanged:** Published Sheets feeds may lag; POST is still `no-cors` and cannot certify success; old rows still require source-Sheet edits. This task does not add an AI agent, so **iFixAi is intentionally not used**.


## Masthead / alignment refinement (Nov 2026)

- The brand is a single Saku-inspired wordmark `Lily’s.` plus a transparent sticker and the calm `little sky journal` caption. Never display the old `Saku` logo.
- A stable 8/12/16px spacing rhythm replaces stacked negative margins, especially around the monthly report, Cinna note, sky tools, and mood controls.
- The sky toggle and Cinna companion are 44px peers on mobile; neither floats over content.
- The dock mascot is a real form trigger with a bounded tap target, not an illustration that masks the transaction list.
- The night palette keeps a light masthead with dark navy text for contrast and continuity.
- Test mobile widths of 320/390 and tablet/desktop widths of 768/1440; do not hide financial data behind decorative elements.
