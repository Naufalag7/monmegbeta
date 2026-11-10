/* Lily opening, floating controls, and customizable main banner artwork. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const main = $("#main");
  if (!main) return;

  // Preserve all existing section nodes, data bindings, and event listeners.
  const overview = main.querySelector(":scope > .overview");
  const banner = main.querySelector(":scope > .lily-banner");
  const toolbar = main.querySelector(":scope > .sky-toolbar");
  const mood = main.querySelector(":scope > .mood-board");
  if (overview && banner && toolbar && mood)
    overview.before(banner, toolbar, mood);

  // The right sticker already owns the real add-transaction handler in script.js.
  // Make the left sticker purely playful, with no duplicate transaction action/menu.
  const companion = $("#companion-button");
  const menu = $("#companion-menu");
  if (companion) {
    const sparkleButton = companion.cloneNode(true);
    sparkleButton.removeAttribute("aria-controls");
    sparkleButton.removeAttribute("aria-expanded");
    sparkleButton.setAttribute("aria-label", "Cinna kasih sparkles");
    sparkleButton.title = "Tap for a little sparkle";
    companion.replaceWith(sparkleButton); // removes the old click-to-open-menu listener
    if (menu) menu.hidden = true;
    const messages = [
      "A little sparkle for Lily! ♡",
      "Cinna sends tiny hearts ✦",
      "A cloud of love, just for you ♡",
    ];
    let taps = 0;
    sparkleButton.addEventListener("click", () => {
      if (document.body.dataset.profile !== "lily") return;
      const image = $("#companion-image");
      if (image)
        image.src = `assets/stickers/${taps % 2 ? "bouncy" : "cheer"}.webp`;
      const host = $("#lily-companion");
      if (host) {
        host.classList.remove("is-wiggling");
        void host.offsetWidth;
        host.classList.add("is-wiggling");
      }
      if (typeof burstAt === "function") burstAt(sparkleButton, 15);
      if (typeof notify === "function")
        notify(messages[taps++ % messages.length]);
    });
  }

  // Lily chooses the LARGE artwork in the opening banner, not the small header icon.
  // All choices use the sticker files already in the website; no data logic changes.
  // Upgrade older installs: remove the legacy overlay button and its dialog.
  // The large banner artwork itself is the only control in this version.
  const oldStickerButton = banner?.querySelector(
    "#lily-banner-picker-trigger, .lily-banner-picker-trigger",
  );
  if (oldStickerButton) {
    oldStickerButton.remove();
    $("#lily-banner-picker")?.remove();
  }
  const bannerArt = $(".lily-banner .lily-banner-art");
  const stickers = [
    ["cinna-cloud-friends", "Cloud friends"],
    ["hello", "Hello"],
    ["cheer", "Cheer"],
    ["bouncy", "Bouncy"],
    ["grumpy", "Grumpy"],
    ["cinna-smile", "Smile"],
    ["cinna-snooze", "Sleepy"],
    ["cinna-bashful", "Shy"],
    ["cinna-giggle", "Giggle"],
    ["cinna-cupid", "Cupid"],
    ["cinna-royal", "Royal"],
    ["cinna-shy", "Blush"],
    ["cinna-blue-hug", "Hug"],
    ["cinna-skateboard", "Skate"],
    ["cinna-colorful", "Party"],
    ["cinna-tiny-hug", "Tiny hug"],
    ["cinna-pixel", "Pixel"],
    ["cinna-classic", "Classic"],
  ];
  if (banner && bannerArt && !$("#lily-banner-picker")) {
    const KEY = "lfw.lily.bannerSticker.v1";
    const files = stickers.map(([name]) => name);
    const valid = new Set(files);
    const getSaved = (key) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };
    const setSaved = (value) => {
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* optional */
      }
    };
    const fallback = "cinna-cloud-friends";
    let preference = getSaved(KEY) ?? fallback;
    if (preference !== "shuffle" && !valid.has(preference))
      preference = fallback;
    let shown = fallback;
    const stickerNames = new Map(stickers);

    const setArtwork = (file) => {
      if (!valid.has(file)) return;
      shown = file;
      bannerArt.src = `assets/stickers/${file}.webp`;
      bannerArt.alt = `Stiker Cinnamoroll: ${stickerNames.get(file)}`;
      bannerArt.classList.toggle("lily-banner-custom-art", file !== fallback);
    };
    const randomArtwork = (avoidCurrent = false) => {
      const options = avoidCurrent
        ? files.filter((file) => file !== shown)
        : files;
      const pool = options.length ? options : files;
      setArtwork(pool[Math.floor(Math.random() * pool.length)]);
    };
    if (preference === "shuffle") randomArtwork();
    else setArtwork(preference);
    // Prevent a broken asset from leaving the banner blank.
    bannerArt.addEventListener("error", () => {
      if (!bannerArt.src.endsWith(`/${fallback}.webp`)) setArtwork(fallback);
    });

    // The artwork IS the control: no extra floating change button.
    // Keep its original position and dimensions, while making it keyboard-accessible.
    const trigger = bannerArt;
    trigger.id = "lily-banner-art-trigger";
    trigger.classList.add("lily-banner-art-clickable");
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute(
      "aria-label",
      "Ganti stiker pada gambar besar banner Lily",
    );
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", "lily-banner-picker");
    trigger.title = "Ketuk Cinna untuk memilih stiker";

    const picker = document.createElement("dialog");
    picker.id = "lily-banner-picker";
    picker.className = "lily-banner-picker";
    picker.setAttribute("aria-labelledby", "lily-banner-picker-title");
    const top = document.createElement("div");
    top.className = "lily-banner-picker-head";
    const header = document.createElement("div");
    const heading = document.createElement("h2");
    heading.id = "lily-banner-picker-title";
    heading.textContent = "Cinna di langit Lily ♡";
    const info = document.createElement("p");
    info.textContent =
      "Pilih gambar untuk banner pembuka, atau acak setiap buka jurnal.";
    header.append(heading, info);
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "lily-banner-picker-close";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Tutup pilihan stiker");
    top.append(header, closeButton);

    const choices = document.createElement("div");
    choices.className = "lily-banner-picker-options";
    const buttons = [];
    const select = (file) => {
      preference = file;
      setSaved(file);
      setArtwork(file);
      updatePressed();
      picker.close();
    };
    for (const [file, label] of stickers) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "lily-banner-picker-option";
      option.dataset.bannerSticker = file;
      option.setAttribute("aria-label", `Gunakan ${label} di banner`);
      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      image.width = 54;
      image.height = 48;
      image.src = `assets/stickers/${file}.webp`;
      const caption = document.createElement("span");
      caption.textContent = label;
      option.append(image, caption);
      option.addEventListener("click", () => select(file));
      buttons.push(option);
      choices.append(option);
    }
    const footer = document.createElement("div");
    footer.className = "lily-banner-picker-footer";
    const original = document.createElement("button");
    original.type = "button";
    original.className = "lily-banner-picker-reset";
    original.textContent = "☁ Gambar awal";
    original.addEventListener("click", () => select(fallback));
    const shuffle = document.createElement("button");
    shuffle.type = "button";
    shuffle.className = "lily-banner-picker-shuffle";
    shuffle.textContent = "✧ Acak tiap buka";
    shuffle.addEventListener("click", () => {
      preference = "shuffle";
      setSaved("shuffle");
      randomArtwork(true);
      updatePressed();
      picker.close();
    });
    footer.append(original, shuffle);
    function updatePressed() {
      buttons.forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.bannerSticker === preference),
        ),
      );
      shuffle.setAttribute("aria-pressed", String(preference === "shuffle"));
    }
    picker.append(top, choices, footer);
    document.body.append(picker); // dialog top layer cannot be clipped by the banner
    updatePressed();
    trigger.addEventListener("click", () => {
      if (document.body.dataset.profile === "lily") picker.showModal();
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        trigger.click();
      }
    });
    closeButton.addEventListener("click", () => picker.close());
    picker.addEventListener("click", (event) => {
      if (event.target === picker) picker.close();
    });
    document.querySelectorAll(".profile[data-profile]").forEach((button) => {
      button.addEventListener("click", () => {
        if (picker.open) picker.close();
      });
    });
  }

  // A tiny opt-in fixed-place weather card. No device location, IP lookup, or
  // browser geolocation permission is used. Approximate neighborhood coordinates
  // deliberately avoid embedding the two street addresses in a public repo.
  const header = $(".topbar");
  if (header && !$("#lily-weather")) {
    const locations = Object.freeze({
      karangbendo: {
        label: "Karang Bendo",
        lat: -7.7997,
        lon: 110.4166,
      },
      dabag: {
        label: "Dabag",
        lat: -7.7738,
        lon: 110.4012,
      },
      bandung: {
        label: "Bandung",
        lat: -6.9219,
        lon: 107.6069,
      },
    });
    const savedKey = "lfw.lily.weatherPlace.v1";
    const remember = (key) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };
    const store = (value) => {
      try {
        localStorage.setItem(savedKey, value);
      } catch {
        /* optional */
      }
    };
    const element = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const card = element("section", "lily-weather");
    card.id = "lily-weather";
    card.setAttribute("aria-label", "Cuaca pilihan lokasi");
    const weatherInfo = element("div", "lily-weather-info");
    const icon = element("span", "lily-weather-icon", "☁");
    icon.setAttribute("aria-hidden", "true");
    const reading = element("div", "lily-weather-reading");
    const degrees = element("strong", "lily-weather-temp", "—°");
    degrees.id = "lily-weather-temp";
    const condition = element(
      "span",
      "lily-weather-condition",
      "Memuat cuaca…",
    );
    condition.id = "lily-weather-condition";
    condition.setAttribute("aria-live", "polite");
    reading.append(degrees, condition);
    weatherInfo.append(icon, reading);
    const actions = element("div", "lily-weather-actions");
    const selectLabel = element("label", "sr", "Lokasi cuaca");
    const picker = element("select", "lily-weather-select");
    picker.id = "lily-weather-place";
    selectLabel.htmlFor = picker.id;
    for (const [value, location] of Object.entries(locations)) {
      const option = element("option", null, location.label);
      option.value = value;
      picker.append(option);
    }
    const source = element("a", "lily-weather-source", "Open-Meteo");
    source.href = "https://open-meteo.com/";
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.title = "Data cuaca Open-Meteo";
    const refresh = element("button", "lily-weather-refresh", "↻");
    refresh.type = "button";
    refresh.setAttribute("aria-label", "Muat ulang cuaca");
    refresh.title = "Perbarui cuaca";
    actions.append(selectLabel, picker, refresh, source);
    card.append(weatherInfo, actions);
    $(".brand")?.after(card);

    const codes = new Map([
      [0, ["☀", "Cerah"]],
      [1, ["🌤", "Cerah berawan"]],
      [2, ["⛅", "Berawan"]],
      [3, ["☁", "Mendung"]],
      [45, ["🌫", "Berkabut"]],
      [48, ["🌫", "Berkabut"]],
      [51, ["🌦", "Gerimis"]],
      [53, ["🌦", "Gerimis"]],
      [55, ["🌧", "Gerimis"]],
      [56, ["🌧", "Gerimis"]],
      [57, ["🌧", "Gerimis"]],
      [61, ["🌧", "Hujan"]],
      [63, ["🌧", "Hujan"]],
      [65, ["🌧", "Hujan deras"]],
      [66, ["🌧", "Hujan"]],
      [67, ["🌧", "Hujan"]],
      [71, ["☁", "Salju"]],
      [73, ["☁", "Salju"]],
      [75, ["☁", "Salju"]],
      [77, ["☁", "Salju"]],
      [80, ["🌦", "Hujan lokal"]],
      [81, ["🌧", "Hujan lokal"]],
      [82, ["🌧", "Hujan deras"]],
      [85, ["☁", "Salju"]],
      [86, ["☁", "Salju"]],
      [95, ["⛈", "Badai petir"]],
      [96, ["⛈", "Badai petir"]],
      [99, ["⛈", "Badai petir"]],
    ]);
    let key = remember(savedKey);
    if (!(key in locations)) key = "karangbendo";
    picker.value = key;
    let controller = null,
      generation = 0,
      latest = 0;
    const loading = (message) => {
      degrees.textContent = "—°";
      icon.textContent = "☁";
      condition.textContent = message;
    };
    async function updateWeather(force = false) {
      if (!force && Date.now() - latest < 20 * 60 * 1000) return;
      const id = ++generation;
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      const timeout = setTimeout(() => controller.abort(), 12000);
      const place = locations[key];
      loading("Memuat cuaca…");
      refresh.disabled = true;
      const params = new URLSearchParams({
        latitude: String(place.lat),
        longitude: String(place.lon),
        current: "temperature_2m,weather_code,is_day",
        timezone: "Asia/Jakarta",
        forecast_days: "1",
      });
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
          {
            signal,
            cache: "no-store",
          },
        );
        if (!response.ok) throw new Error("Cuaca tidak bisa dimuat");
        const payload = await response.json();
        if (signal.aborted || id !== generation) return;
        const data = payload?.current;
        if (
          !data ||
          !Number.isFinite(data.temperature_2m) ||
          !Number.isFinite(data.weather_code)
        )
          throw new Error("Format cuaca tidak sesuai");
        const detail = codes.get(data.weather_code) || ["☁", "Cuaca berubah"];
        icon.textContent =
          data.weather_code === 0 && data.is_day === 0 ? "🌙" : detail[0];
        degrees.textContent = `${Math.round(data.temperature_2m)}°C`;
        condition.textContent = detail[1];
        latest = Date.now();
        card.title = `Cuaca perkiraan ${place.label} · ${detail[1]} · Data: Open-Meteo`;
      } catch (error) {
        if (id !== generation) return;
        loading("Cuaca tak tersedia");
        card.title = "Cek koneksi internet, lalu tekan muat ulang cuaca";
      } finally {
        clearTimeout(timeout);
        if (id === generation) refresh.disabled = false;
      }
    }
    picker.addEventListener("change", () => {
      key = picker.value;
      store(key);
      latest = 0;
      updateWeather(true);
    });
    refresh.addEventListener("click", () => {
      latest = 0;
      updateWeather(true);
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && document.body.dataset.profile === "lily")
        updateWeather();
    });
    document.querySelectorAll(".profile[data-profile]").forEach((button) => {
      button.addEventListener("click", () => {
        if (document.body.dataset.profile === "lily") updateWeather();
      });
    });
    updateWeather(true);
  }

  // The technical system card duplicates these details, so hide it only for Lily
  // through CSS. Keep live sync health and the real refresh control available.
  const syncCard = $("#sync-detail");
  const refresh = $("#refresh-btn");
  if (syncCard && refresh && !$("#lily-sync-toggle")) {
    const details = document.createElement("button");
    details.type = "button";
    details.id = "lily-sync-toggle";
    details.className = "lily-sync-toggle";
    details.setAttribute(
      "aria-controls",
      "sync-detail-text sync-pending sync-last",
    );
    details.setAttribute("aria-expanded", "false");
    details.textContent = "Detail";
    refresh.before(details);
    details.addEventListener("click", () => {
      const open = syncCard.classList.toggle("lily-sync-open");
      details.setAttribute("aria-expanded", String(open));
      details.textContent = open ? "Tutup" : "Detail";
    });
  }
})();
