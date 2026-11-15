/* Line icons drawn in code by the team (24x24 grid, 1.8 stroke, round caps). They replace the system emojis
   used as icons. Level data keeps its emoji keys; Icons.el(emoji or name) maps them to a drawn icon.
   Icons.el(key, cls) -> <svg> element (falls back to the emoji text if a key is unknown)
   Icons.medal(kind)  -> drawn medal: gold | silver | bronze | none */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  var P = {
    wave: '<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    cactus: '<path d="M10 21V6a2 2 0 0 1 4 0v15"/><path d="M10 13H7.5A2.5 2.5 0 0 1 5 10.5V8"/><path d="M14 11h2.5A2.5 2.5 0 0 0 19 8.5V6.5"/><path d="M6 21h12"/>',
    backpack: '<path d="M6 9a6 6 0 0 1 12 0v10.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z"/><path d="M9.5 5V3.8A1.3 1.3 0 0 1 10.8 2.5h2.4a1.3 1.3 0 0 1 1.3 1.3V5"/><path d="M9 14h6v4H9z"/><path d="M6 12h12"/>',
    radio: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8l10-5"/><circle cx="15.5" cy="14" r="2.6"/><path d="M6.5 12.5h4M6.5 15.5h4"/>',
    newspaper: '<path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v10a2 2 0 0 1-2 2"/><path d="M7.5 9h6M7.5 12.5h6M7.5 16h4"/>',
    books: '<path d="M4 4h4v16H4zM8 6h4v14H8z"/><path d="M13.2 6.7l3.8-1 3.9 14.5-3.8 1z"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/><path d="M10.5 18.5h3"/>',
    phonePing: '<rect x="4.5" y="4.5" width="10" height="17" rx="2.2"/><path d="M8.5 18.5h2"/><path d="M17.5 4.5a4 4 0 0 1 2.5 3.7M17 1.8a7 7 0 0 1 4.8 5.6"/>',
    house: '<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    school: '<path d="M2.5 10L12 5l9.5 5"/><path d="M5 9v11h14V9"/><path d="M10 20v-4h4v4"/><path d="M12 5V2.5h3"/><circle cx="12" cy="11.5" r="1.6"/>',
    chat: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    clock: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M12 13.5l2.6 1.6"/><path d="M9.5 2.5h5M12 2.5V6"/><path d="M18.5 6.5l1.3-1.3"/>',
    bucket: '<path d="M4.5 8h15l-1.8 12.2a1.5 1.5 0 0 1-1.5 1.3H7.8a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M4.5 8a7.5 5 0 0 1 15 0"/><path d="M7 12.5h10"/>',
    cap: '<path d="M4 15a8 8 0 0 1 16 0z"/><path d="M4 15h17.5a2.5 2.5 0 0 1-2.5 2.5H4"/><path d="M12 7v-1.5"/>',
    shower: '<path d="M4 21V7a4 4 0 0 1 7.5-2"/><path d="M8.5 6.5h7a3.5 3.5 0 0 0-7 0z"/><path d="M10 11v1.5M12 12v1.5M14 11v1.5M11 15.5v1.5M13 16.5V18M15 15v1.5"/>',
    tap: '<path d="M3 9h7l2-2h4a3 3 0 0 1 3 3v2h-4v-1H12l-2 2H3z"/><path d="M8 4.5h4M10 4.5V7"/><path d="M17 16.5c0 1.6-1 2.6-1 3.5a1 1 0 0 0 2 0c0-.9-1-1.9-1-3.5z"/>',
    plug: '<path d="M9 3v4.5M15 3v4.5"/><path d="M6.5 7.5h11V11a5.5 5.5 0 0 1-11 0z"/><path d="M12 16.5V21"/>',
    cow: '<path d="M7 8.5h10a3 3 0 0 1 3 3v2.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2.5a3 3 0 0 1 3-3z"/><path d="M7 8.5L4.5 5.5M17 8.5l2.5-3"/><circle cx="9.3" cy="12" r=".6" fill="currentColor"/><circle cx="14.7" cy="12" r=".6" fill="currentColor"/><path d="M9 20.5v-3.5M15 20.5v-3.5"/>',
    river: '<path d="M2.5 18l6-9 3.5 5 2.5-3 7 7"/><path d="M8 21c2-1.2 4-1.2 6 0s4 1.2 6 0"/><circle cx="17" cy="6" r="2"/>',
    desert: '<path d="M2 19c3-3 6-4.5 10-4.5s7 1.5 10 4.5"/><path d="M2 21.5h20"/><circle cx="17" cy="6.5" r="2.5"/><path d="M7 14.5V9.5a1.2 1.2 0 0 1 2.4 0v5"/>',
    tree: '<path d="M12 21v-6"/><path d="M12 3a5.5 5.5 0 0 1 5.4 6.5A4 4 0 0 1 16 16.5H8a4 4 0 0 1-1.4-7A5.5 5.5 0 0 1 12 3z"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6z"/><path d="M12 14.5c0-3-2-5-6-5 0 3.5 2 5 6 5z"/><path d="M7 21h10"/>',
    sunrise: '<path d="M2.5 20.5l6-8 3.5 4.5 3-3.5 6.5 7"/><path d="M8.5 9a3.5 3.5 0 0 1 7 0"/><path d="M12 2.5v2M5.5 6.5l1.4 1M18.5 6.5l-1.4 1"/>',
    cyclone: '<path d="M4 8.5c3-5 11-6 15-2"/><path d="M20 15.5c-3 5-11 6-15 2"/><circle cx="12" cy="12" r="3.2"/><path d="M8.8 12a3.2 3.2 0 0 1 2-3M15.2 12a3.2 3.2 0 0 1-2 3"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l3.8 2.8-1.5 4.4H9.7l-1.5-4.4z"/><path d="M12 7.5V3.2M15.8 10.3l4-1.5M14.3 14.7l2.6 3.6M9.7 14.7l-2.6 3.6M8.2 10.3l-4-1.5"/>',
    shield: '<path d="M12 2.8l7.5 3v5.7c0 4.6-3.2 8.3-7.5 9.7-4.3-1.4-7.5-5.1-7.5-9.7V5.8z"/><path d="M8.6 12l2.4 2.4 4.4-4.8"/>',
    folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.2l2 2.2h8.8A1.5 1.5 0 0 1 21 8.7V18.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/><path d="M3 10.5h18"/>',
    book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5V20"/>',
    bolt: '<path d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z"/>',
    chart: '<path d="M3.5 20.5h17"/><path d="M6 17v-4M10 17V8M14 17v-6M18 17V5"/>',
    bulb: '<path d="M9 17.5h6M10 21h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.1 1.4-1.1 3h-4.8c0-1.6-.3-2.4-1.1-3z"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20"/><path d="M12 8.5C10.5 5 7 4.5 7 6.8 7 8.5 10 8.5 12 8.5zM12 8.5c1.5-3.5 5-4 5-1.7 0 1.7-3 1.7-5 1.7z"/>',
    satellite: '<path d="M9.5 9.5l5 5"/><rect x="9" y="9" width="6" height="6" rx="1" transform="rotate(45 12 12)"/><path d="M4.6 7.4l2.8-2.8 3.2 3.2-2.8 2.8zM16.6 19.4l2.8-2.8-3.2-3.2-2.8 2.8z"/><path d="M15.5 4a4.5 4.5 0 0 1 4.5 4.5"/>',
    checkSquare: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 12.2l2.8 2.8L16.5 9"/>',
    share: '<path d="M12 15V3.5M7.5 8L12 3.5 16.5 8"/><path d="M5 12.5v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-6.5"/>',
    arrowRight: '<path d="M4 12h15.5M13.5 6l6 6-6 6"/>',
    retry: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L19.5 9"/><path d="M19.5 4v5h-5"/><path d="M19.5 12a7.5 7.5 0 0 1-13 5.1L4.5 15"/><path d="M4.5 20v-5h5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    trophy: '<path d="M7 3.5h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4a3 3 0 0 0 3 4M17 5.5h3a3 3 0 0 1-3 4"/><path d="M12 13.5v3.5M8 21h8M9.5 17h5v4h-5z"/>',
    megaphone: '<path d="M3.5 10v4h3l9 5V5l-9 5z"/><path d="M6.5 14l1.5 6h2.5l-1-5.5"/><path d="M18.5 9a3.5 3.5 0 0 1 0 6"/>',
    clover: '<path d="M12 12c-3.5 0-5.5-1.5-5.5-3.5S8.5 5.2 12 7.2c3.5-2 5.5-.7 5.5 1.3S15.5 12 12 12z"/><path d="M12 12c-3.5 0-5.5 1.5-5.5 3.5s2 3.3 5.5 1.3c3.5 2 5.5.7 5.5-1.3S15.5 12 12 12z"/><path d="M12 17l2 4.5"/>',
    suitcase: '<rect x="3.5" y="7" width="17" height="13" rx="2"/><path d="M9 7V4.5h6V7"/><path d="M8 7v13M16 7v13"/>',
    microscope: '<path d="M9 3.5l4 2-4 8-4-2z"/><path d="M11 11.5a5.5 5.5 0 0 1 3.5 9"/><path d="M5 21h14M8 17.5h6"/><path d="M13 5.5l1.2-2.3"/>',
    people: '<circle cx="8.5" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M3 20a5.5 5.5 0 0 1 11 0"/><path d="M14 15.2A4.5 4.5 0 0 1 21 19"/>',
    magnifier: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3l5.2 5.2"/><path d="M7.5 12l2-2.5 1.8 1.5 2.2-3"/>',
    van: '<path d="M2.5 17V7.5A1.5 1.5 0 0 1 4 6h10l4.5 5H21v6z"/><path d="M14 6v5h4.5"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    flashlight: '<path d="M7.5 3.5h9l-2 6v11h-5v-11z"/><path d="M7.5 3.5L9.5 9.5h5"/><path d="M12 13.5v2"/>',
    sunCloud: '<path d="M8.5 9.5a3.5 3.5 0 0 1 6.6-1.6"/><path d="M11 2.5v1.8M4.8 5.3l1.3 1.2M3.5 11h1.8"/><path d="M8 20.5h10a3.5 3.5 0 0 0 .5-7A5 5 0 0 0 9 14.5a3 3 0 0 0-1 6z"/>',
    ambulance: '<path d="M2.5 17V7h11v10M13.5 10h4.5l3.5 4v3h-8"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/><path d="M8 9.5v4M6 11.5h4"/>',
    thermometer: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 17.5V9"/><path d="M17 6h3M17 9.5h2"/>',
    drop: '<path d="M12 3c3 4.3 6 7.4 6 11a6 6 0 0 1-12 0c0-3.6 3-6.7 6-11z"/>',
    drops: '<path d="M9 4c2 2.8 4 4.8 4 7.2a4 4 0 0 1-8 0C5 8.8 7 6.8 9 4z"/><path d="M17 11c1.5 2 3 3.5 3 5.3a3 3 0 0 1-6 0c0-1.8 1.5-3.3 3-5.3z"/>',
    noDrop: '<path d="M12 3c3 4.3 6 7.4 6 11a6 6 0 0 1-12 0c0-3.6 3-6.7 6-11z"/><path d="M4 4l16 16"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    truck: '<path d="M2.5 16.5V6h11v10.5M13.5 9.5h4.5l3.5 4v3h-8"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    snowflake: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.5 4l2.5 2 2.5-2M9.5 20l2.5-2 2.5 2"/>',
    hourglass: '<path d="M6.5 3h11M6.5 21h11"/><path d="M7.5 3c0 5 9 5 9 9s-9 4-9 9M16.5 3c0 5-9 5-9 9s9 4 9 9"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    arrowLeft: '<path d="M20 12H4.5M10.5 6l-6 6 6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.7 3.6 5.7 3.6 9s-1.1 6.3-3.6 9c-2.5-2.7-3.6-5.7-3.6-9S9.5 5.7 12 3z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".7" fill="currentColor"/>',
    archive: '<rect x="3" y="4" width="18" height="4.5" rx="1"/><path d="M4.5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V8.5"/><path d="M8.5 15.5l2.5-3 2 2 2.5-3.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'
  };

  /* emoji used by the level data and screens -> drawn icon */
  var MAP = {
    '🌊': 'wave', '☀️': 'sun', '🌵': 'cactus', '🎒': 'backpack', '📻': 'radio', '📰': 'newspaper', '📚': 'books', '📱': 'phone',
    '📲': 'phonePing', '🏡': 'house', '🏫': 'school', '💬': 'chat', '⏱️': 'clock', '🪣': 'bucket', '🧢': 'cap', '🚿': 'shower',
    '🚰': 'tap', '🔌': 'plug', '🐄': 'cow', '🏞️': 'river', '🏜️': 'desert', '🌳': 'tree', '🌱': 'sprout', '🌄': 'sunrise',
    '🌀': 'cyclone', '⚽': 'ball', '🛡️': 'shield', '🗂️': 'folder', '📖': 'book', '⚡': 'bolt', '📊': 'chart', '🧠': 'bulb',
    '🎁': 'gift', '🛰️': 'satellite', '✅': 'checkSquare', '📤': 'share', '➡️': 'arrowRight', '🔁': 'retry', '✨': 'sparkle',
    '🏆': 'trophy', '📢': 'megaphone', '🍀': 'clover', '🧳': 'suitcase', '🔬': 'microscope', '🤝': 'people', '🔎': 'magnifier',
    '🚐': 'van', '🔦': 'flashlight', '🌤️': 'sunCloud', '🚑': 'ambulance', '🥵': 'thermometer', '💧': 'drop', '🌙': 'moon',
    '🚚': 'truck', '💦': 'drops', '🚱': 'noDrop', '❄️': 'snowflake', '✓': 'check', '▶': 'play'
  };

  function el(key, cls, level, place) {
    var art = window.Assets && Assets.artIcon(key, level, place);
    if (art) return Assets.icon(art, 'ic ico-art ' + (cls || ''));
    var name = P[key] ? key : MAP[key];
    if (!name) { var s = document.createElement('span'); s.className = 'ic-text ' + (cls || ''); s.textContent = key || ''; return s; }
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'ic ' + (cls || ''));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = P[name];
    return svg;
  }

  var MEDAL = { gold: ['#f2c14e', '#a8741a'], silver: ['#d5dde6', '#7c8a99'], bronze: ['#d98a52', '#8a4a22'] };
  function medal(kind, cls) {
    if (!MEDAL[kind]) { var m = el('magnifier', 'medal-none ' + (cls || '')); return m; }
    if (window.Assets) return Assets.icon('medal-' + kind, 'medal-svg m-' + kind + ' ' + (cls || ''));
    var c = MEDAL[kind], svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 48 56'); svg.setAttribute('class', 'medal-svg m-' + kind + ' ' + (cls || ''));
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.innerHTML = '<path d="M14 2h8l4 16h-8zM34 2h-8l-4 16h8z" fill="#2166ac"/><path d="M22 2h4l-1 10h-2z" fill="#b2182b"/>' +
      '<circle cx="24" cy="36" r="17" fill="' + c[0] + '"/><circle cx="24" cy="36" r="17" fill="none" stroke="' + c[1] + '" stroke-width="2.5"/>' +
      '<circle cx="24" cy="36" r="11.5" fill="none" stroke="' + c[1] + '" stroke-width="1.5" stroke-dasharray="2 2.4"/>' +
      '<path d="M24 28.5l2.3 4.7 5.1.7-3.7 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.7-3.6 5.1-.7z" fill="' + c[1] + '"/>';
    return svg;
  }

  /* [icon, text] pair for App.h children */
  function label(key, text) { return [el(key), document.createTextNode(text)]; }

  /* texts from i18n/strings.js that start with an emoji (e.g. "📖 Ver el glosario completo") keep their wording;
     the leading emoji is drawn as an icon when the text is applied to the page */
  if (window.App && App.applyI18n) {
    var apply = App.applyI18n;
    App.applyI18n = function () {
      apply.apply(App, arguments);
      document.querySelectorAll('[data-i18n]').forEach(function (n) {
        var txt = n.textContent, m = txt.match(/^(\S+)\s+/);
        if (m && MAP[m[1]]) { n.textContent = ''; label(m[1], txt.slice(m[0].length)).forEach(function (c) { n.appendChild(c); }); }
      });
    };
  }

  window.Icons = { el: el, medal: medal, label: label, has: function (k) { return !!(P[k] || MAP[k]); } };
})();
