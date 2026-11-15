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

  function stars(n, w, h, seed) {
    var s = '', x = seed;
    for (var i = 0; i < n; i++) {
      x = (x * 9301 + 49297) % 233280; var a = x / 233280;
      x = (x * 9301 + 49297) % 233280; var b = x / 233280;
      s += '<circle cx="' + (a * w).toFixed(1) + '" cy="' + (b * h).toFixed(1) + '" r="' + (0.6 + (i % 3) * 0.5) + '" fill="#fff" opacity="' + (0.35 + (i % 4) * 0.15) + '"' + (i % 5 === 0 ? ' class="twinkle"' : '') + '/>';
    }
    return s;
  }

  var SKY = {
    calm:  { costa: ['#4fb8f0', '#d9f4ff'], centro: ['#5aa9f2', '#ffe7b0'], norte: ['#6aa6dd', '#f6dcae'], home: ['#0b1a3a', '#274b86'] },
    storm: { costa: ['#1b2540', '#56688a'], centro: ['#26304d', '#68789a'], norte: ['#2a3350', '#6d7a96'], home: ['#10172b', '#3b4a6b'] },
    alert: { costa: ['#3a1c5a', '#ff8a4c'], centro: ['#c43d1c', '#ffbe55'], norte: ['#8a2d12', '#ffb35a'], home: ['#3a1c5a', '#ff8a4c'] }
  };

  function cloud(x, y, s, col, delay) {
    return '<g class="cloud" style="animation-delay:' + delay + 's" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + col + '">' +
      '<ellipse cx="0" cy="0" rx="26" ry="10"/><ellipse cx="-14" cy="-6" rx="14" ry="10"/><ellipse cx="8" cy="-9" rx="16" ry="12"/></g>';
  }

  function rain() {
    var s = '<g class="rain" stroke="#bfe3ff" stroke-width="1.4" stroke-linecap="round" opacity=".7">';
    for (var i = 0; i < 26; i++) { var x = 10 + i * 15.5, y = (i * 37) % 60; s += '<line x1="' + x + '" y1="' + (20 + y) + '" x2="' + (x - 5) + '" y2="' + (34 + y) + '" style="animation-delay:' + ((i % 7) * 0.12) + 's"/>'; }
    return s + '</g>';
  }

  function sun(mood, zone) {
    if (mood === 'storm') return '';
    if (mood === 'alert') {
      var hot = zone !== 'costa';
      return '<g transform="translate(300 ' + (hot ? 88 : 150) + ')"><g class="rays" stroke="#ffd166" stroke-width="3" stroke-linecap="round" opacity=".7">' +
        [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(function (a) { return '<line x1="0" y1="-' + (hot ? 50 : 38) + '" x2="0" y2="-' + (hot ? 62 : 48) + '" transform="rotate(' + a + ')"/>'; }).join('') +
        '</g><circle r="' + (hot ? 40 : 30) + '" fill="#ffe08a"/><circle r="' + (hot ? 40 : 30) + '" fill="#ff7b54" opacity=".35"/></g>';
    }
    return '<g transform="translate(310 62)"><circle r="40" fill="#fff3b0" opacity=".35"/><circle r="24" fill="#ffe27a"/></g>';
  }

  function ground(zone, mood) {
    var dark = mood === 'storm', warm = mood === 'alert';
    if (zone === 'costa') {
      var sea = dark ? ['#16324f', '#0c1f36'] : warm ? ['#5a2a6e', '#2a1245'] : ['#1fa8c9', '#0b6a99'];
      var palm = dark ? '#0d1a2a' : warm ? '#1c0f2e' : '#0f5c4d';
      return '<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sea[0] + '"/><stop offset="1" stop-color="' + sea[1] + '"/></linearGradient></defs>' +
        '<rect y="150" width="400" height="90" fill="url(#sea)"/>' +
        '<path class="wave w1" d="M-40,160 q25,-12 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 V240 H-40z" fill="#fff" opacity=".22"/>' +
        '<path class="wave w2" d="M-60,176 q25,-12 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 V240 H-60z" fill="#fff" opacity=".16"/>' +
        '<path d="M0,214 q60,-22 120,-8 t140,0 t140,-6 V240 H0z" fill="' + (dark ? '#2b3a4d' : warm ? '#4a2a3a' : '#f2d7a1') + '"/>' +
        '<g fill="' + palm + '" transform="translate(48 206)"><path d="M0,0 q-2,-34 4,-62 l4,1 q-5,28 -2,61z"/>' +
        '<path d="M5,-62 q-26,-14 -42,6 q22,-10 42,-2z M6,-62 q22,-18 42,-2 q-22,-6 -42,6z M6,-62 q-6,-24 -26,-26 q18,8 22,26z M6,-62 q10,-22 32,-22 q-24,6 -30,22z"/></g>' +
        '<g fill="' + (dark ? '#1a2740' : warm ? '#2a1a3a' : '#fff') + '" transform="translate(310 190)"><rect x="-26" y="-10" width="52" height="26" rx="2"/><path d="M-30,-10 L0,-32 L30,-10z" fill="' + (dark ? '#0e1a2e' : warm ? '#3a1d2e' : '#e4572e') + '"/></g>';
    }
    if (zone === 'centro') {
      var h1 = dark ? '#2e3a5a' : warm ? '#7a2e2e' : '#8e6bb8', h2 = dark ? '#222c48' : warm ? '#5b2024' : '#6a4a96', gr = dark ? '#1b2238' : warm ? '#4a1c1c' : '#c79a5a';
      var boxes = ['#ff6b6b', '#ffd166', '#4cc9f0', '#06d6a0', '#f78fb3', '#ff9f43', '#9b5de5'], hs = '';
      for (var i = 0; i < 14; i++) {
        var bx = 20 + i * 26 + (i % 3) * 3, by = 150 + ((i * 17) % 38);
        hs += '<rect x="' + bx + '" y="' + by + '" width="17" height="14" fill="' + boxes[i % boxes.length] + '" opacity="' + (dark ? .45 : .95) + '"/><rect x="' + (bx + 6) + '" y="' + (by + 6) + '" width="4" height="8" fill="#0f1b2d" opacity=".55"/>';
      }
      return '<path d="M0,170 q60,-70 130,-34 t120,-26 t150,36 V240 H0z" fill="' + h1 + '"/><path d="M0,190 q80,-44 150,-12 t130,-16 t120,18 V240 H0z" fill="' + h2 + '"/>' +
        '<g>' + hs + '</g><rect y="214" width="400" height="26" fill="' + gr + '"/>';
    }
    if (zone === 'norte') {
      var m1 = dark ? '#2a3552' : warm ? '#7b3a2a' : '#5b7fa6', m2 = dark ? '#1c263f' : warm ? '#5a281d' : '#41648c', sand = dark ? '#2a2f3c' : warm ? '#a8582e' : '#e0b36b';
      var cx = dark ? '#16301f' : warm ? '#3a3a14' : '#2e8b57';
      return '<path d="M0,176 L58,120 L84,140 L112,92 L134,126 L158,104 L190,150 L240,168 L300,128 L350,150 L400,138 V240 H0z" fill="' + m1 + '"/>' +
        '<path d="M60,196 L120,150 L150,168 L186,126 L220,160 L270,148 L330,184 L400,170 V240 H60z" fill="' + m2 + '"/>' +
        '<rect y="200" width="400" height="40" fill="' + sand + '"/>' +
        '<path d="M20,222 l22,-6 l8,10 m40,-6 l20,4 l10,-8 m60,10 l18,-6 l12,8" stroke="#00000033" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<g fill="' + cx + '" transform="translate(330 214)"><rect x="-5" y="-40" width="10" height="42" rx="5"/><rect x="-22" y="-26" width="8" height="18" rx="4"/><rect x="-22" y="-14" width="22" height="8" rx="4"/><rect x="14" y="-30" width="8" height="20" rx="4"/><rect x="0" y="-18" width="22" height="8" rx="4"/></g>' +
        '<g fill="' + cx + '" transform="translate(70 222) scale(.7)"><rect x="-5" y="-40" width="10" height="42" rx="5"/><rect x="-22" y="-26" width="8" height="18" rx="4"/><rect x="-22" y="-14" width="22" height="8" rx="4"/></g>';
    }
    return '<path d="M0,200 q100,-30 200,-6 t200,-10 V240 H0z" fill="#0a1226"/>';
  }

  function scene(zone, mood) {
    zone = SKY.calm[zone] ? zone : 'home'; mood = SKY[mood] ? mood : 'calm';
    var sky = SKY[mood][zone];
    var cl = mood === 'storm' ? '#39455f' : mood === 'alert' ? '#ffd9a0' : '#ffffff';
    var parts = '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="240" fill="url(#sky)"/>' +
      (zone === 'home' || mood === 'alert' && zone === 'costa' ? stars(30, 400, 120, 11) : '') +
      sun(mood, zone) + cloud(70, 52, 1.1, cl, 0) + cloud(230, 34, .8, cl, -4) + (mood === 'storm' ? cloud(150, 70, 1.4, cl, -8) + cloud(340, 62, 1.1, cl, -2) : '') +
      ground(zone, mood) + (mood === 'storm' ? rain() : '');
    if (mood === 'storm' && zone === 'costa') {
      parts += '<g class="swirl" transform="translate(320 70)" fill="none" stroke="#dfe9ff" stroke-width="3" opacity=".55" stroke-linecap="round"><path d="M0,0 m-6,0 a6,6 0 1 1 6,6 a14,14 0 1 1 -14,-14 a24,24 0 1 1 24,24"/></g>';
    }
    return svg(parts, '0 0 400 240', 'scene-art');
  }

  window.Art = { logo: logo, scene: scene };
})();
