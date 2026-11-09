# Layout QA — November 9, 2026

## Root causes

1. Overlapping old responsive styles hid the header caption and constrained the brand in mobile layouts.
2. Multiple independent corner radii and negative margins made the hero, sky toolbar and status strip visually disconnected.
3. The Cinna Catat art extended too far above the fixed navigation dock, looking like it sat on top of the transaction row.
4. Replacing the brand element without migrating the profile-switching JS would have broken `render()`. Both HTML and the script have now been updated together.

## Acceptance results

- Pass: 320 / 390 / 768 / 1440 CSS widths; `document.documentElement.scrollWidth <= innerWidth`.
- Pass: header-to-status gap 8–9px; totals-to-banner gap 16–20px; banner-to-toolbar gap 7–8px; toolbar-to-mood gap 12px.
- Pass: Day/Night and companion controls have equal 44px mobile heights.
- Pass: Cinna Catat opens the existing modal, with no duplicate form.
- Pass: tapping note shortcut Makan then Transport leaves Transport only.
- Pass: profile switching shows Nopal’s wordmark at all four sizes without overflow.
- Pass: sticker gallery header and navigation render on mobile.
- Pass: 5 existing Node financial parsing/amount/data tests.
- Pass: no browser JavaScript exceptions in test runs.

Test environment: in-memory Chromium rendering with real local HTML/CSS/JS and inline actual sticker image data, but only a *synthetic CSV* substituted for the external Sheets requests. No test transactions are included in the website files. Live Google Sheets submission and actual synchronization remain unverified.

## CSS ownership

The most recent, intentional overrides are at the bottom of existing `finishing.css`; avoid adding another separate stylesheet just to fix a margin. Preserve style loading order: `style.css`, `redesign.css`, `polish.css`, `finishing.css`.
