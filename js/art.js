/* Original vector art (drawn in code by the team, no external images, no real people).
   Art.logo()            -> magnifier whose lens holds climate stripes
   Art.scene(zone, mood) -> layered landscape: zone = costa | centro | norte | home, mood = calm | storm | alert */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  function svg(markup, viewBox, cls, label) {
    var d = document.createElement('div');
    d.innerHTML = '<svg xmlns="' + NS + '" viewBox="' + viewBox + '" class="' + cls + '" preserveAspectRatio="xMidYMid slice" ' +
      (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true" focusable="false"') + '>' + markup + '</svg>';
    return d.firstChild;
  }

  function logo() {
    var cols = ['#2166ac', '#4393c3', '#92c5de', '#f7f7f7', '#f4a582', '#d6604d', '#b2182b'], st = '';
    cols.forEach(function (c, i) { st += '<rect x="' + (7 + i * 4.3) + '" y="6" width="4.4" height="30" fill="' + c + '"/>'; });
    return svg('<defs><clipPath id="lensClip"><circle cx="21" cy="21" r="13"/></clipPath></defs>' +
      '<g clip-path="url(#lensClip)">' + st + '</g>' +
      '<circle cx="21" cy="21" r="14.5" fill="none" stroke="#f3f5f8" stroke-width="3.4"/>' +
      '<line x1="31.5" y1="31.5" x2="43" y2="43" stroke="#f3f5f8" stroke-width="5.5" stroke-linecap="round"/>', '0 0 48 48', 'art-logo');
  }

  /* Scenes live in the game's world: the sky is the case city's real temperature stripes (NASA POWER, anomaly vs
     1991-2020), muted when calm, nearly hidden in a storm and at full strength in a heat alert. The land is a stack of
     graphite silhouettes with a contour line in the zone colour. */
  var CITY = { costa: 'veracruz', centro: 'pachuca', norte: 'monterrey' };
  var ZONE = { costa: ['#4393c3', '#92c5de'], centro: ['#d6604d', '#f4a582'], norte: ['#bf812d', '#dfc27d'], home: ['#4393c3', '#92c5de'] };
  var MOOD = { calm: { op: 0.72, base: '#171b22' }, storm: { op: 0.16, base: '#0e1116' }, alert: { op: 0.95, base: '#171b22' } };
  var G = ['#262c36', '#1b2027', '#12161c', '#0a0c10'];

  function sky(zone, mood) {
    var m = MOOD[mood], s = '<rect width="400" height="240" fill="' + m.base + '"/>';
    if (CITY[zone] && window.Stripes && window.App && App.data) {
      var st = Stripes.series(CITY[zone]), mx = Math.max.apply(null, st.anom.map(Math.abs)) || 1, w = 400 / st.anom.length;
      s += '<g opacity="' + m.op + '">';
      st.anom.forEach(function (v, i) { s += '<rect x="' + (i * w).toFixed(2) + '" y="0" width="' + (w + 0.3).toFixed(2) + '" height="240" fill="' + Stripes.color(v / mx) + '"/>'; });
      s += '</g>';
    }
    return s + '<rect width="400" height="240" fill="url(#shade)"/>';
  }

  function cloud(x, y, w, delay, op) {
    return '<g class="cloud" style="animation-delay:' + delay + 's" fill="#0a0c10" opacity="' + op + '">' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="9" rx="4.5"/><rect x="' + (x + w * 0.22) + '" y="' + (y - 11) + '" width="' + (w * 0.5) + '" height="9" rx="4.5"/></g>';
  }

  function rain() {
    var s = '<g class="rain" stroke="#d1e5f0" stroke-width="1.3" stroke-linecap="round" opacity=".55">';
    for (var i = 0; i < 26; i++) { var x = 10 + i * 15.5, y = (i * 37) % 60; s += '<line x1="' + x + '" y1="' + (20 + y) + '" x2="' + (x - 5) + '" y2="' + (34 + y) + '" style="animation-delay:' + ((i % 7) * 0.12) + 's"/>'; }
    return s + '</g>';
  }

  function sun(mood, zone) {
    if (mood === 'storm') return '';
    var hot = mood === 'alert', col = hot ? '#fddbc7' : '#d1e5f0', y = hot && zone === 'costa' ? 120 : 70;
    var s = '<g transform="translate(316 ' + y + ')" fill="none" stroke="' + col + '">';
    if (hot) s += '<g class="rays" stroke-width="2.5" stroke-linecap="round" opacity=".8">' +
      [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(function (a) { return '<line x1="0" y1="-38" x2="0" y2="-48" transform="rotate(' + a + ')"/>'; }).join('') + '</g>';
    return s + '<circle r="26" stroke-width="3"/><circle r="17" stroke-width="1.5" opacity=".6"/><circle r="8" stroke-width="1.5" opacity=".4"/></g>';
  }

  function ridge(d, fill, edge) {
    return '<path d="' + d + '" fill="' + fill + '"/>' + (edge ? '<path d="' + d.replace(/ ?V240 H-?\d+z$/, '') + '" fill="none" stroke="' + edge + '" stroke-width="1.6" stroke-linejoin="round" opacity=".85"/>' : '');
  }

  function ground(zone, mood) {
    var z = ZONE[zone] || ZONE.home, edge = mood === 'storm' ? '#3a424e' : z[1];
    if (zone === 'costa') {
      return '<rect y="150" width="400" height="90" fill="' + G[2] + '"/>' +
        '<path class="wave w1" d="M-40,160 q25,-10 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0" fill="none" stroke="' + z[1] + '" stroke-width="1.6" opacity=".7"/>' +
        '<path class="wave w2" d="M-60,178 q25,-10 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0" fill="none" stroke="' + z[0] + '" stroke-width="1.6" opacity=".6"/>' +
        '<path class="wave w1" d="M-40,196 q25,-10 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0" fill="none" stroke="' + z[0] + '" stroke-width="1.2" opacity=".35"/>' +
        ridge('M0,214 q60,-22 120,-8 t140,0 t140,-6 V240 H0z', G[3], edge) +
        '<g fill="' + G[3] + '" transform="translate(48 206)"><path d="M0,0 q-2,-34 4,-62 l4,1 q-5,28 -2,61z"/>' +
        '<path d="M5,-62 q-26,-14 -42,6 q22,-10 42,-2z M6,-62 q22,-18 42,-2 q-22,-6 -42,6z M6,-62 q-6,-24 -26,-26 q18,8 22,26z M6,-62 q10,-22 32,-22 q-24,6 -30,22z"/></g>' +
        '<g fill="' + G[3] + '" transform="translate(330 200)"><rect x="-22" y="-8" width="44" height="22"/><path d="M-26,-8 L0,-26 L26,-8z"/><rect x="-5" y="2" width="10" height="12" fill="' + z[1] + '" opacity=".8"/></g>';
    }
    if (zone === 'centro') {
      var hs = '';
      for (var i = 0; i < 14; i++) {
        var bx = 16 + i * 27 + (i % 3) * 3, by = 160 + ((i * 17) % 34), lit = (i * 7) % 3 === 0;
        hs += '<rect x="' + bx + '" y="' + by + '" width="18" height="' + (240 - by) + '" fill="' + G[2] + '"/>' +
          '<rect x="' + (bx + 6) + '" y="' + (by + 5) + '" width="5" height="5" fill="' + (lit ? z[1] : G[0]) + '" opacity="' + (lit ? .9 : .7) + '"/>';
      }
      return ridge('M0,170 q60,-70 130,-34 t120,-26 t150,36 V240 H0z', G[0], edge) +
        ridge('M0,190 q80,-44 150,-12 t130,-16 t120,18 V240 H0z', G[1], null) + hs +
        '<rect y="216" width="400" height="24" fill="' + G[3] + '"/>';
    }
    if (zone === 'norte') {
      var cac = '<rect x="-5" y="-40" width="10" height="42" rx="5"/><rect x="-22" y="-26" width="8" height="18" rx="4"/><rect x="-22" y="-14" width="22" height="8" rx="4"/>';
      return ridge('M0,176 L58,120 L84,140 L112,92 L134,126 L158,104 L190,150 L240,168 L300,128 L350,150 L400,138 V240 H0z', G[0], edge) +
        ridge('M60,196 L120,150 L150,168 L186,126 L220,160 L270,148 L330,184 L400,170 V240 H60z', G[1], null) +
        '<rect y="202" width="400" height="38" fill="' + G[2] + '"/>' +
        '<path d="M20,222 l22,-6 l8,10 m40,-6 l20,4 l10,-8 m60,10 l18,-6 l12,8" stroke="' + z[0] + '" stroke-opacity=".45" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        '<g fill="' + G[3] + '" transform="translate(330 214)">' + cac + '<rect x="14" y="-30" width="8" height="20" rx="4"/><rect x="0" y="-18" width="22" height="8" rx="4"/></g>' +
        '<g fill="' + G[3] + '" transform="translate(70 224) scale(.7)">' + cac + '</g>';
    }
    return ridge('M0,200 q100,-30 200,-6 t200,-10 V240 H0z', G[3], edge);
  }

  function scene(zone, mood) {
    zone = ZONE[zone] ? zone : 'home'; mood = MOOD[mood] ? mood : 'calm';
    var parts = '<defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0c10" stop-opacity=".55"/><stop offset=".55" stop-color="#0a0c10" stop-opacity="0"/></linearGradient></defs>' +
      sky(zone, mood) + sun(mood, zone) +
      cloud(40, 52, 90, 0, mood === 'storm' ? .85 : .55) + cloud(210, 34, 64, -4, mood === 'storm' ? .85 : .45) +
      (mood === 'storm' ? cloud(120, 76, 120, -8, .9) + cloud(300, 62, 80, -2, .9) : '') +
      ground(zone, mood) + (mood === 'storm' ? rain() : '');
    if (mood === 'storm' && zone === 'costa') {
      parts += '<g class="swirl" transform="translate(320 70)" fill="none" stroke="#d1e5f0" stroke-width="2.5" opacity=".6" stroke-linecap="round"><path d="M0,0 m-6,0 a6,6 0 1 1 6,6 a14,14 0 1 1 -14,-14 a24,24 0 1 1 24,24"/></g>';
    }
    return svg(parts, '0 0 400 240', 'scene-art');
  }

  window.Art = { logo: logo, scene: scene };
})();
