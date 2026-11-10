/* Nopal Starlight: presentation only. The shared finance engine remains the source of truth. */
(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const root = document.body;
  const intro = $('.intro');
  if (!intro || $('#nopal-starfield')) return;

  const IMAGE_ROOT = 'assets/nopal-cats/';
  const makeCat = (file, className, width, height) => {
    const img = document.createElement('img');
    img.src = `${IMAGE_ROOT}${file}.webp`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.className = `nopal-cat ${className}`;
    img.width = width;
    img.height = height;
    img.decoding = 'async';
    img.loading = 'lazy';
    img.draggable = false;
    return img;
  };
  // Fallbacks for people upgrading from the earlier, three-cat version.
  const spots = [
    ['.intro > div:first-child', 'fluffy', 'nopal-intro-cat', 90, 90],
    ['.metric-income', 'sit', 'nopal-metric-cat', 46, 46],
    ['.metric-expense', 'cheeky', 'nopal-metric-cat', 46, 46],
    ['.metric-savings', 'squish', 'nopal-metric-cat', 46, 46],
    ['.metric-cash', 'blep', 'nopal-metric-cat', 46, 46],
    ['.chart-head > span:first-child', 'nap', 'nopal-chart-cat', 38, 38],
    ['#history-title', 'glance', 'nopal-heading-cat', 40, 40],
    ['#category-title', 'sit', 'nopal-heading-cat', 40, 40],
    ['#entry-dialog .dialog-header', 'curious', 'nopal-dialog-cat', 45, 45],
  ];
  for (const [selector, name, cls, width, height] of spots) {
    const parent = $(selector);
    if (parent && !parent.querySelector(`.${cls}`)) parent.append(makeCat(name, cls, width, height));
  }
  const logo = $('.brand-wordmark');
  if (logo && !$('.nopal-cat-logo')) logo.after(makeCat('kitten', 'nopal-cat-logo', 48, 48));
  const desktopAdd = $('#new-entry-top');
  if (desktopAdd && !desktopAdd.querySelector('.nopal-cat-desktop')) {
    desktopAdd.prepend(makeCat('curious', 'nopal-cat-desktop', 38, 38));
  }
  const mobileAdd = $('#new-entry-mobile');
  if (mobileAdd && !mobileAdd.querySelector('.nopal-cat-add')) {
    const wrap = document.createElement('span');
    wrap.className = 'nopal-cat nopal-cat-add';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.append(makeCat('curious', 'nopal-cat-add-image', 62, 64));
    mobileAdd.prepend(wrap);
  }
  const tab = $('.profile[data-profile="nopal"]');
  if (tab && !tab.querySelector('.nopal-profile-icon')) {
    tab.prepend(makeCat('glance', 'nopal-profile-icon', 24, 26));
  }

  // Static, deterministic constellations. No animation loop, canvas or location tracking.
  const starfield = document.createElement('span');
  starfield.className = 'nopal-starfield';
  starfield.id = 'nopal-starfield';
  starfield.setAttribute('aria-hidden', 'true');
  let seed = 27416;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const stars = document.createDocumentFragment();
  for (let i = 0; i < 53; i++) {
    const star = document.createElement('span');
    star.className = 'nopal-star';
    star.style.setProperty('--sx', `${(random() * 96 + 2).toFixed(2)}%`);
    star.style.setProperty('--sy', `${(random() * 92 + 3).toFixed(2)}%`);
    star.style.setProperty('--sr', `${(random() * 1.25 + .7).toFixed(2)}px`);
    star.style.setProperty('--sd', `${(random() * 6.5).toFixed(2)}s`);
    star.style.setProperty('--st', `${(random() * 4 + 3.8).toFixed(2)}s`);
    star.style.setProperty('--so', `${(random() * .4 + .4).toFixed(2)}`);
    if (i % 9 === 0) star.classList.add('nopal-star-warm');
    stars.append(star);
  }
  starfield.append(stars);
  intro.prepend(starfield);

  const details = intro.querySelector(':scope > div:not(.nopal-starfield)');
  const toggle = document.createElement('button');
  toggle.id = 'nopal-stars-toggle';
  toggle.type = 'button';
  toggle.className = 'nopal-stars-toggle';
  const storageKey = 'nopal.starlight.enabled.v1';
  let enabled = true;
  try { enabled = localStorage.getItem(storageKey) !== 'false'; } catch { /* Optional preference. */ }
  function setStars(value) {
    enabled = value;
    root.dataset.nopalStars = enabled ? 'on' : 'off';
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('aria-label', enabled ? 'Matikan cahaya bintang' : 'Nyalakan cahaya bintang');
    toggle.innerHTML = `<span aria-hidden="true">${enabled ? '✦' : '✧'}</span> Bintang ${enabled ? 'menyala' : 'mati'}`;
  }
  setStars(enabled);
  toggle.addEventListener('click', () => {
    setStars(!enabled);
    try { localStorage.setItem(storageKey, String(enabled)); } catch { /* Preference is optional. */ }
  });
  details?.append(toggle);

  // Nopal has no monthly-budget panel. Category navigation goes to a real, visible section.
  const category = $('.category-section');
  if (category) category.id = 'nopal-categories';
  const lastTab = $('.mobile-dock .dock-link[data-dock="savings"]');
  const desktopTab = $('.desktop-nav a:last-child');
  const updateTab = () => {
    const nopal = root.dataset.profile === 'nopal';
    if (lastTab) {
      lastTab.href = nopal ? '#nopal-categories' : '#savings-section';
      const caption = lastTab.querySelector('span');
      if (caption) caption.textContent = nopal ? 'Kategori' : 'Tabungan';
    }
    if (desktopTab) {
      desktopTab.href = nopal ? '#nopal-categories' : '#savings-section';
      desktopTab.textContent = nopal ? 'Kategori' : 'Tabungan';
    }
    if (nopal) {
      const theme = $('meta[name="theme-color"]');
      if (theme) theme.content = '#070911';
    }
  };
  updateTab();
  document.querySelectorAll('.profile[data-profile]').forEach((button) => {
    button.addEventListener('click', updateTab);
  });

  let queued = false;
  function highlightCurrentSection() {
    queued = false;
    if (root.dataset.profile !== 'nopal' || window.innerWidth > 735 || !category) return;
    const history = $('#history-section');
    const focusLine = window.innerHeight * .38;
    const target = category.getBoundingClientRect().top <= focusLine
      ? 'savings' : history && history.getBoundingClientRect().top <= focusLine ? 'history' : 'home';
    document.querySelectorAll('.mobile-dock .dock-link[data-dock]').forEach((link) => {
      const active = link.dataset.dock === target;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(highlightCurrentSection);
  }, { passive: true });
  lastTab?.addEventListener('click', () => {
    if (root.dataset.profile !== 'nopal') return;
    requestAnimationFrame(highlightCurrentSection);
  });
})();
