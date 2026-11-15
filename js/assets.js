/* Illustrations made by the team (see ASSETS.md): characters, case maps, icons, medals and cover.
   They are AI-generated and labeled as such on the Method screen and in the footer.
   Assets.img(src, cls, alt)      -> <img> (decorative when alt is empty)
   Assets.portrait(level, place)  -> character image id for a place, or null
   Assets.mapFor(level, place, i) -> map id for a place banner
   Assets.art[emoji|level:place]  -> icon file that replaces a drawn line icon */
(function () {
  'use strict';
  var CH = 'assets/chars/', MP = 'assets/maps/', IC = 'assets/icons/';

  function img(src, cls, alt, w, hgt) {
    var i = document.createElement('img');
    i.src = src; i.className = cls || ''; i.alt = alt || ''; i.decoding = 'async';
    if (!alt) i.setAttribute('aria-hidden', 'true');
    if (w) i.width = w;
    if (hgt) i.height = hgt;
    return i;
  }

  /* who stands at each place (names match the places in i18n/strings.js; minors are never drawn) */
  var PORTRAIT = {
    'costa:radio': 'rios', 'costa:paper': 'tacho', 'costa:neighbor': 'meche', 'costa:refuge': 'rios',
    'centro:radio': 'romulo', 'centro:paper': 'arechiga', 'centro:rain': 'elena', 'centro:phone': 'lupita',
    'norte:rain': 'sofia', 'norte:cold': 'homero', 'norte:neighbor': 'chayo'
  };

  /* source-of-information icons drawn by the team; other places keep the line icons */
  var ART = { '📻': 'radio', '📰': 'newspaper', '💬': 'chat', 'centro:phone': 'health' };
  var VARIABLE = { t2m: 'temp', t2mmax: 'tmax', t2mmin: 'tmin', prectotcorr: 'rain', rh2m: 'humidity' };

  var BANNER = {
    costa: ['ver-coast', 'ver-pier', 'ver-plaza'],
    centro: ['pac-center', 'pac-heat'],
    norte: ['mty-view', 'mty-street']
  };
  /* case image per intro / outro panel (index = panel) */
  var CINE = {
    costa: { intro: ['ver-coast', 'ver-storm', 'ver-storm'], outro: ['ver-storm', 'ver-storm', 'ver-storm', 'ver-pier', 'ver-plaza'] },
    centro: { intro: ['pac-center', 'pac-heat', 'pac-heat'], outro: ['pac-heat', 'pac-heat', 'pac-heat', 'pac-center', 'pac-center'] },
    norte: { intro: ['mty-view', 'mty-street', 'mty-view'], outro: ['mty-street', 'mty-street', 'mty-view', 'mty-view', 'mty-view'] }
  };
  var HUB = { costa: ['ver-coast', 'ver-storm'], centro: ['pac-center', 'pac-heat'], norte: ['mty-view', 'mty-snow'] };

  window.Assets = {
    img: img,
    char: function (id, cls) { return img(CH + id + '.webp', cls); },
    map: function (id, cls) { return img(MP + id + '.webp', cls); },
    icon: function (name, cls) { return img(IC + name + '.webp', cls); },
    portrait: function (level, place) { return PORTRAIT[level + ':' + place] || null; },
    artIcon: function (key, level, place) { return ART[level + ':' + place] || ART[key] || null; },
    varIcon: function (v) { return VARIABLE[v] || null; },
    bannerFor: function (level, i) { var l = BANNER[level] || BANNER.costa; return l[i % l.length]; },
    cine: function (level, kind, i) { var c = CINE[level]; return c ? c[kind][i] || null : null; },
    hub: function (level, late) { var l = HUB[level] || HUB.costa; return l[late ? 1 : 0]; },
    all: function () {
      var out = [];
      Object.keys(BANNER).forEach(function (k) { BANNER[k].forEach(function (m) { out.push(MP + m + '.webp'); }); });
      return out;
    }
  };
})();
