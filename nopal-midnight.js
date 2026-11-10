/* Nopal's Midnight Journal — mascot placement and local profile preference.
   Visual only: never changes transactions, budgets, Sheets URLs, or submit handlers. */
(() => {
  'use strict';
  const CAT_ROOT = 'assets/nopal-cats/';
  const $ = selector => document.querySelector(selector);

  function cat(file, extraClass, width, height, lazy = true) {
    const image = document.createElement('img');
    image.src = `${CAT_ROOT}${file}.webp`;
    image.className = `nopal-cat ${extraClass}`;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.decoding = 'async';
    image.loading = lazy ? 'lazy' : 'eager';
    image.width = width;
    image.height = height;
    image.draggable = false;
    return image;
  }

  // Reusable injection helper: safe even if the script is accidentally included twice.
  function insert(selector, file, className, width, height, where = 'append', lazy = true) {
    const host = $(selector);
    if (!host || host.querySelector(`.${className}`)) return;
    const image = cat(file, className, width, height, lazy);
    host[where](image);
    return image;
  }

  // Identity and one-tap transaction entry — standalone transparent artwork.
  const brandName = $('.brand-wordmark');
  if (brandName && !$('.nopal-cat-logo')) {
    brandName.after(cat('kitten', 'nopal-cat-logo', 48, 48, false));
  }
  insert('#new-entry-top', 'curious', 'nopal-cat-desktop', 38, 38, 'prepend', false);
  const mobileAdd = $('#new-entry-mobile');
  if (mobileAdd && !mobileAdd.querySelector('.nopal-cat-add')) {
    const art = document.createElement('span');
    art.className = 'nopal-cat nopal-cat-add';
    art.setAttribute('aria-hidden', 'true');
    art.append(cat('curious', 'nopal-cat-add-image', 61, 63, false));
    mobileAdd.prepend(art);
  }
  insert('.profile[data-profile="nopal"]', 'glance', 'nopal-profile-icon', 24, 26, 'prepend', false);

  // All nine images have a deliberate place; numbers are never covered.
  insert('.intro > div:first-child', 'fluffy', 'nopal-intro-cat', 82, 82, 'append', false);
  const cards = [
    ['.metric-income', 'sit'],
    ['.metric-expense', 'cheeky'],
    ['.metric-savings', 'squish'],
    ['.metric-cash', 'blep'],
  ];
  cards.forEach(([selector, file]) => insert(selector, file, 'nopal-metric-cat', 45, 45, 'append', false));
  insert('.chart-head > span:first-child', 'nap', 'nopal-chart-cat', 36, 36);

  // Small secondary accents spread across later sections, never blocking actions.
  insert('#history-title', 'glance', 'nopal-heading-cat', 42, 42);
  insert('#budget-title', 'fluffy', 'nopal-heading-cat', 42, 42);
  insert('#category-title', 'sit', 'nopal-heading-cat', 42, 42);
  insert('.note-panel .eyebrow', 'nap', 'nopal-note-cat', 36, 36);
  insert('#entry-dialog .dialog-header', 'curious', 'nopal-dialog-cat', 43, 43);

  // One preference per browser/device; the original app owns the profile state.
  const KEY = 'lfw.lastProfile.v1';
  const nopalButton = $('.profile[data-profile="nopal"]');
  let saved;
  try { saved = localStorage.getItem(KEY); } catch { /* Storage is optional. */ }
  if (saved === 'nopal' && nopalButton) nopalButton.click();
  document.querySelectorAll('.profile[data-profile]').forEach(button => {
    button.addEventListener('click', () => {
      try { localStorage.setItem(KEY, button.dataset.profile); } catch { /* optional */ }
    });
  });
})();
