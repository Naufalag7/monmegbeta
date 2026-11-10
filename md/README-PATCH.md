# Lily's Fun World — Compact Sheet + PWA (patch only)

This is a SMALL PATCH, not the entire website. No `script.js`, Google Sheets URL,
profile logic, or existing financial data is replaced.

## 1. Copy files into the root of your existing GitHub repo

Put `compact-sheet.css` and `manifest.webmanifest` beside `index.html`.
Copy the entire `icons/` folder beside them.

```
monmegbeta/
  index.html                  (already present; edit below)
  stickers.html               (already present; edit below)
  finishing.css               (already present; do not replace)
  compact-sheet.css           (NEW)
  manifest.webmanifest        (NEW)
  icons/
    cinna-192.png             (NEW)
    cinna-512.png             (NEW)
    cinna-maskable-512.png    (NEW)
    cinna-apple-180.png       (NEW)
```

## 2. Edit `index.html`

In `<head>`, insert these THREE lines near your CSS files, BEFORE `</head>`:

```html
<link rel="stylesheet" href="compact-sheet.css">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" sizes="180x180" href="icons/cinna-apple-180.png">
```

The CSS link MUST be after `finishing.css`, or older styles can override the sheet.

For a better Android keyboard experience, find the EXISTING viewport meta line:
`<meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport"/>`

Replace that whole line with:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
```

Keep zoom enabled (do not add user-scalable=no).

## 3. Edit `stickers.html`

Add these TWO lines in `<head>`:

```html
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" sizes="180x180" href="icons/cinna-apple-180.png">
```

Do not load `compact-sheet.css` on stickers.html. It has no transaction form.

## 4. Test and deploy

- In VS Code: right click index.html -> Open with Live Server
  (or use any localhost web server; do not test installation via file://).
- Tap the Cinna "Catat" button. The form should slide up from the bottom.
- Check Save is visible at 390px; at 320px / small heights, the form should scroll.
- Submit ONLY a genuine test transaction when you are ready to verify Google Sheets;
  the patch does not change write logic.
- Commit and push these new files and edits. On GitHub Pages, use HTTPS:
  `https://YOUR_USERNAME.github.io/monmegbeta/` (or your configured Pages URL).
- Android Chrome/Samsung Internet: open site -> menu -> Install app / Add to Home Screen.
- iPhone: open in Safari -> Share -> Add to Home Screen; choose Open as Web App.

## Scope and safety

- PWA manifest + platform icons makes the site installable.
- NO service worker or offline transaction queue is included on purpose.
  Finance/Sheets data stays online-only. Nothing is falsely marked saved offline.
- The sheet retains native <dialog> accessibility, Escape/backdrop close,
  existing input validation, the shortcuts, and the current Google Sheets integration.
- Test your specific S25 Ultra keyboard on-device: browser chrome/virtual keyboard
  behavior cannot be fully simulated by desktop screenshot tests.

If you later want auto-update/offline browsing, that should be designed separately
from transaction writes and sync truth.
