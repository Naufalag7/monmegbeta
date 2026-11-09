# Design direction: Lily’s little Cinna sky

**Read:** A working personal money tracker for Lily, expressed as a Cinnamoroll sticker journal. Lily explicitly asked for lots of Cinnamoroll, using the 17 user-supplied images. The design retains a separate understated Catppuccin Mocha theme for Nopal.

**Voice:** Sweet, lighthearted, slightly scrapbook-like. Indonesian transaction language remains practical and concise. Small English notes mirror the supplied Cinnamoroll inspiration. No invented testimonials, product promises, or placeholder financial stats.

**Palette:** Powder blue (#dff1fd) and warm paper white (#fffefa); rosy pink (#a94879) is the one emotional accent. Deeper blue (#315f80) is reserved for legible text and primary actions. The colors follow the original artwork’s blue eyes, rosy cheeks, and tan outlines.

**Typography:** Fredoka gives headings their soft, playful shape; Nunito keeps records, numbers, inputs, and controls readable. Both have system fallbacks.

**Visual motif:** A personal collection of Cinnamoroll stickers, fluffy cloud silhouettes, dotted stationery, and a few paper-tape details. The 12 cropped JPGs are kept on white sticker tiles to preserve the white characters; the four true-transparent PNGs appear in the header and mood selector. The supplied winter collage has its own postcard.

**Structure:** Functional information first. Hero and mood selector introduce the personality, then actual financial overview, transaction history, and budgets. The sticker book comes after the money tools, so the page feels character-full without obscuring the purpose.

**Liveliness dials (anti-slop):** ENERGY 3 / RHYTHM 3 / MOTION 1. High character energy, varied section shapes, minimal movement. Reduced-motion support is explicit.

## Reasons for the major choices

- **Blue background:** links to the character’s sky/cloud identity without a generic purple gradient.
- **Pink only on selective words and active mood:** gives the page a recognizable happy accent, rather than coloring every control.
- **Rounded white finance panels:** maintain readable, predictable data spaces; the irregularity lives in the scrapbook, not the numbers.
- **Sticker gallery after the tracker:** fulfills the request to use every artwork without displacing balances or form controls.
- **Four mood buttons:** each user-provided transparent PNG has a real action and a corresponding message.
- **Local image assets:** no external image CDN, no broken links to absent SVGs.
- **Nopal scope:** Lily's character collage is entirely hidden on Nopal's page.

## Interactive edition · November 2026

**User direction:** Everything from the suggested next iteration except the collectible/unlockable sticker diary. The existing simple sticker gallery stays; it does **not** have collection or unlock mechanics. More animation is explicitly wanted.

**Interaction principle:** Cinna reacts to real actions rather than animating all over the finance numbers. Hero clouds drift, stars twinkle, the Cinna companion wiggles when tapped, and stickers tilt on hover. Mobile hit targets themselves stay stationary; only artwork moves. Reduced-motion preference suppresses nonessential motion and particle bursts.

**Savings scene:** a two-column illustrated cloud garden follows the money overview. It uses monthly `Tabungan` totals from the currently selected month, and a savings target entered by Lily and stored locally in the browser. Star visibility is tied to verified progress: five steps at 20%, 40%, 60%, 80%, 100%. An unset goal displays no invented financial target or stars. No gamified purchases or rewards.

**Day/night scene:** daytime is paper blue; nighttime is ink blue with a few quiet stars. Bright financial panels remain readable on both. Default follows the visitor's local clock (18:00–05:59 night); Lily can override it with a saved toggle.

**Secret letter:** a discoverable envelope in the hero reveals a friendly message **from Cinna**, not an impersonation of a real sender. It uses the user's own uploaded picture of Cinna holding a letter.

**Performance and respect:** no third-party animation libraries, no autoplay audio, no mouse-following gimmicks, no continuously generated DOM particles. Heart particles last under a second and appear only on taps or a confirmed Sheets record. The existing Google Sheets API has an opaque `no-cors` POST; an animation cannot claim success until a newly matching entry appears in the published CSV.

**Liveliness dials:** ENERGY 4 / RHYTHM 3 / MOTION 3. Movement has character and meaning; decorative animation never obstructs inputs or financial data.
