# Lily's Cinnamoroll Sky Journal — interactive edition

This release builds on the original `index.zip` redesign, preserving Lily and Nopal profiles, CSV fetch, Apps Script form, monthly overview, transaction history, budgets, CSV download, and all uploaded Cinnamoroll image assets.

## What's new

- **Tap-to-chat floating Cinna:** wiggles, emits tiny hearts, cycles through friendly messages, and naps after 55 seconds without interaction.
- **Live savings cloud:** choose a monthly savings goal on Lily's device; actual `Tabungan` transactions in the selected month grow up to five stars. The goal is remembered in local browser storage, not uploaded to Google Sheets.
- **Saved moods and greetings:** four moods affect the greeting and companion illustration. The page greets Lily based on local time.
- **Day/night sky:** automatic time-of-day appearance with a saved manual switch, moonlit background and soft twinkles.
- **Secret envelope:** opens a letter explicitly written from Cinna.
- **Faster cute expense entry:** one-tap note suggestions compatible with the old budget keyword matching, plus different character art for income, expenses, and savings.
- **More animation:** drifting banner clouds, sparkles, breathing hero illustration, star growth, hover sticker giggles, budget character reactions, quiet floating mascot, and brief heart bursts.
- **More honest send states:** the existing `no-cors` endpoint does not prove a write succeeded. Only a newly observed matching row in the published CSV is celebrated as appearing in the history.

## What is intentionally not included

No unlockable/collectible sticker-diary mechanic (the user opted out of suggestion 3). The existing static sticker gallery and its viewer are still available.

## Setup

1. Upload all files and the `assets/` folder together to any static site host or your current deployment.
2. Open `index.html`. Live finance data uses the previously configured Google Sheets published CSV feeds and Apps Script endpoint in `script.js`.
3. To change the secret letter, edit the text in `#letter-dialog` inside `index.html`.
4. The savings goal, chosen mood, and sky preference are local to each browser and can be changed via the UI. They do not affect the existing Sheets schema.
5. Cinnamoroll characters are Sanrio property; this is an unofficial fan theme. Verify licensing before public distribution.

## Important backend limitation

The original Google Apps Script is contacted with `fetch(..., {mode:'no-cors'})`, which returns no trustworthy confirmation. The UI keeps its "sent, unverified" state until the updated public CSV shows a new matching transaction. If Sheets is slow or unavailable, **check the Sheet before resubmitting**, to prevent duplicates. Publication delay is not a guarantee of failure. The existing published feeds are accessible to anyone with their links. For private finances, replace public CSV sharing and anonymous Apps Script writes with authenticated endpoints.

## Tests

A browser test with stubbed **example data only** (not the live Google account) checked widths of 320px, 390px, 768px and 1440px. Passed: no horizontal overflow, no broken visible images, no JavaScript exceptions, correct sample savings progress, mood selection, sky toggle, letter dialog, companion tap, quick-note shortcuts, and Lily/Nopal isolation. Tests used self-contained inline previews because this environment's managed browser blocks file and localhost navigation. Live Google Sheets write verification and real-account authorization were **not** tested.

## Anti-slop design reference

This release was reviewed against the public [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) rulebook; `DESIGN.md` records why each decorative feature exists. The repository's package/agent skills are not installed in the delivered website, and there is no runtime dependency on them. This is a design review, not a claim of formal certification.
