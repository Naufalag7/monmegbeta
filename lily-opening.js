/* Lily's opening, two independent floating controls, and optional header sticker. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const main = $('#main');
  if (!main) return;

  // Preserve all existing section nodes, data bindings, and event listeners.
  const overview = main.querySelector(':scope > .overview');
  const banner = main.querySelector(':scope > .lily-banner');
  const toolbar = main.querySelector(':scope > .sky-toolbar');
  const mood = main.querySelector(':scope > .mood-board');
  if (overview && banner && toolbar && mood) overview.before(banner, toolbar, mood);

  // The right sticker already owns the real add-transaction handler in script.js.
  // Make the left sticker purely playful, with no duplicate transaction action/menu.
  const companion = $('#companion-button');
  const menu = $('#companion-menu');
  if (companion) {
    const sparkleButton = companion.cloneNode(true);
    sparkleButton.removeAttribute('aria-controls');
    sparkleButton.removeAttribute('aria-expanded');
    sparkleButton.setAttribute('aria-label', 'Cinna kasih sparkles');
    sparkleButton.title = 'Tap for a little sparkle';
    companion.replaceWith(sparkleButton); // removes the old click-to-open-menu listener
    if (menu) menu.hidden = true;
    const messages = ['A little sparkle for Lily! ♡', 'Cinna sends tiny hearts ✦', 'A cloud of love, just for you ♡'];
    let taps = 0;
    sparkleButton.addEventListener('click', () => {
      if (document.body.dataset.profile !== 'lily') return;
      const image = $('#companion-image');
      if (image) image.src = `assets/stickers/${taps % 2 ? 'bouncy' : 'cheer'}.webp`;
      const host = $('#lily-companion');
      if (host) {
        host.classList.remove('is-wiggling');
        void host.offsetWidth;
        host.classList.add('is-wiggling');
      }
      if (typeof burstAt === 'function') burstAt(sparkleButton, 15);
      if (typeof notify === 'function') notify(messages[(taps++) % messages.length]);
    });
  }

  // A small choice picker on the header's existing sticker. Every choice is an
  // already-bundled local WebP, so no requests or financial state are involved.
  const mascot = $('.brand-sticker');
  const brand = $('.brand');
  const topbar = $('.topbar');
  const stickers = [
    ['hello', 'Hello'], ['cheer', 'Cheer'], ['bouncy', 'Bouncy'], ['grumpy', 'Grumpy'],
    ['cinna-smile', 'Smile'], ['cinna-snooze', 'Sleepy'], ['cinna-bashful', 'Shy'],
    ['cinna-giggle', 'Giggle'], ['cinna-cupid', 'Cupid'], ['cinna-royal', 'Royal'],
    ['cinna-shy', 'Blush'], ['cinna-blue-hug', 'Hug'],
    ['cinna-skateboard', 'Skate'], ['cinna-colorful', 'Party'],
    ['cinna-tiny-hug', 'Tiny hug'], ['cinna-cloud-friends', 'Friends'],
    ['cinna-pixel', 'Pixel'], ['cinna-classic', 'Classic']
  ];
  if (mascot && brand && topbar && !$('#lily-mascot-trigger')) {
    const key = 'lfw.lily.headerMascot.v1';
    const getSaved = () => { try { return localStorage.getItem(key); } catch { return null; } };
    const setSaved = value => { try { localStorage.setItem(key, value); } catch { /* optional preference */ } };
    const valid = new Set(stickers.map(([file]) => file));
    let preference = getSaved();
    if (preference !== 'shuffle' && !valid.has(preference)) preference = 'hello';
    let lastChoice = '';
    function showMascot(file) {
      if (!valid.has(file)) return;
      mascot.src = `assets/stickers/${file}.webp`;
      lastChoice = file;
    }
    function drawRandom() {
      const alternatives = stickers.map(([name]) => name).filter(name => name !== lastChoice);
      const names = alternatives.length ? alternatives : stickers.map(([name]) => name);
      showMascot(names[Math.floor(Math.random() * names.length)]);
    }
    if (preference === 'shuffle') drawRandom(); else showMascot(preference);
    const trigger = document.createElement('button');
    trigger.type = 'button'; trigger.id = 'lily-mascot-trigger';
    trigger.className = 'lily-mascot-trigger lily-only';
    trigger.setAttribute('aria-label', 'Pilih stiker di header Lily');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'lily-mascot-picker');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.title = 'Ganti stiker header';
    mascot.replaceWith(trigger); trigger.append(mascot);

    const picker = document.createElement('div');
    picker.id = 'lily-mascot-picker'; picker.className = 'lily-mascot-picker lily-only';
    picker.hidden = true;
    picker.setAttribute('role', 'dialog'); picker.setAttribute('aria-label', 'Pilih stiker header');
    const heading = document.createElement('strong'); heading.textContent = 'Header Cinna ♡';
    const info = document.createElement('p'); info.textContent = 'Pilih satu stiker favorit, atau acak tiap buka jurnal.';
    const choices = document.createElement('div'); choices.className = 'lily-mascot-options';
    const buttons = [];
    function markChoice() {
      buttons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.mascot === preference)));
      shuffle.setAttribute('aria-pressed', String(preference === 'shuffle'));
    }
    function setOpen(open, returnFocus = false) {
      picker.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (!open && returnFocus) trigger.focus({preventScroll:true});
    }
    for (const [file, label] of stickers) {
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'lily-mascot-option'; button.dataset.mascot = file;
      button.setAttribute('aria-label', `Gunakan stiker ${label}`);
      const img = document.createElement('img'); img.src = `assets/stickers/${file}.webp`;
      img.alt = ''; img.loading = 'lazy'; img.width = 37; img.height = 36;
      const caption = document.createElement('span'); caption.textContent = label;
      button.append(img, caption);
      button.addEventListener('click', () => {
        preference = file; setSaved(file); showMascot(file); markChoice(); setOpen(false, true);
      });
      choices.append(button); buttons.push(button);
    }
    const shuffle = document.createElement('button'); shuffle.type = 'button';
    shuffle.className = 'lily-mascot-shuffle'; shuffle.dataset.mascot = 'shuffle';
    shuffle.innerHTML = '<span>✧ Acak tiap buka jurnal</span><small>Shuffle</small>';
    shuffle.addEventListener('click', () => {
      preference = 'shuffle'; setSaved('shuffle'); drawRandom(); markChoice(); setOpen(false, true);
    });
    picker.append(heading, info, choices, shuffle); topbar.append(picker);
    markChoice();
    trigger.addEventListener('click', () => setOpen(picker.hidden));
    document.addEventListener('pointerdown', event => {
      if (!picker.hidden && !picker.contains(event.target) && !trigger.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !picker.hidden) { event.stopPropagation(); setOpen(false, true); }
    });
    document.querySelectorAll('.profile[data-profile]').forEach(button => {
      button.addEventListener('click', () => setOpen(false));
    });
  }

  // The technical system card duplicates these details, so hide it only for Lily
  // through CSS. Keep live sync health and the real refresh control available.
  const syncCard = $('#sync-detail');
  const refresh = $('#refresh-btn');
  if (syncCard && refresh && !$('#lily-sync-toggle')) {
    const details = document.createElement('button'); details.type = 'button';
    details.id = 'lily-sync-toggle'; details.className = 'lily-sync-toggle';
    details.setAttribute('aria-controls', 'sync-detail-text sync-pending sync-last');
    details.setAttribute('aria-expanded', 'false'); details.textContent = 'Detail';
    refresh.before(details);
    details.addEventListener('click', () => {
      const open = syncCard.classList.toggle('lily-sync-open');
      details.setAttribute('aria-expanded', String(open));
      details.textContent = open ? 'Tutup' : 'Detail';
    });
  }
})();
