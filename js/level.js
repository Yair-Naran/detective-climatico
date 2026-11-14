/* Level engine: intro cinematic -> hub (time-limited exploration) -> places -> outro cinematic -> results.
   Text keys: <level>_<place>_name/_text/_title/_short/_q/_opt_<id>/_fb_<id>/_after (see i18n/strings.js). */
(function () {
  'use strict';
  var h = function () { return App.h.apply(null, arguments); };
  var t = function (k, v) { return App.t(k, v); };
  var S = null; // level state

  function root() { return document.getElementById('screen-level'); }
  function k(suffix) { return S.cfg.id + '_' + suffix; }
  function place(id) { return S.cfg.places.filter(function (p) { return p.id === id; })[0]; }
  function byRole(fn) { return S.cfg.places.filter(fn)[0]; }
  function refugePlace() { return byRole(function (p) { return p.cat === 'refuge'; }); }
  function packPlace() { return byRole(function (p) { return p.type === 'backpack'; }); }
  function helpPlace() { return byRole(function (p) { return p.cat === 'help'; }); }
  function doneOf(p) { return p ? S.done[p.id] : null; }
  function minCost(p) { return p.options && p.cost === undefined ? Math.min.apply(null, p.options.map(function (o) { return o.cost; })) : p.cost; }
  function costLabel(p) {
    if (p.cost !== undefined) return t('costN', { h: p.cost });
    var cs = p.options.map(function (o) { return o.cost; });
    return t('costRange', { a: Math.min.apply(null, cs), b: Math.max.apply(null, cs) });
  }

  /* ---------- scoring ---------- */
  function score(final) {
    var sc = S.cfg.scoring, r = { backpack: 0, refuge: 0, info: 0, help: 0, share: 0 };
    Object.keys(S.done).forEach(function (id) {
      var p = place(id), d = S.done[id];
      if (p.type === 'backpack') {
        var essentials = p.items.filter(function (i) { return i.ok; }).length;
        r.backpack = Math.min(sc.backpack, Math.round(d.okCount * sc.backpack / Math.min(p.slots, essentials)));
      }
      else if (p.type === 'clue') r.info += p.points;
      else if (p.type === 'data') r.info += d.correct ? p.points : 2;
      else if (p.type === 'choice') r[p.cat] = d.opt.pts;
    });
    r.info = Math.min(r.info, sc.info);
    if (final && !doneOf(refugePlace())) r.refuge = S.cfg.refugeFallback;
    var total = 0; Object.keys(r).forEach(function (c) { total += r[c]; });
    return { parts: r, total: Math.round(total) };
  }
  function medalFor(pct) {
    var m = S.cfg.medals;
    return pct >= m.gold ? 'gold' : pct >= m.silver ? 'silver' : pct >= m.bronze ? 'bronze' : 'none';
  }
  var MEDAL_ICON = { gold: '🥇', silver: '🥈', bronze: '🥉', none: '🔎' };

  function alertLevel() {
    var f = S.hoursLeft / S.hours;
    return f > 0.8 ? 'blue' : f > 0.6 ? 'green' : f > 0.4 ? 'yellow' : f > 0.2 ? 'orange' : 'red';
  }

  /* ---------- top status bar ---------- */
  function statusBar() {
    var a = alertLevel(), pct = score(false).total;
    return h('div', { class: 'status' },
      h('div', { class: 'stat' },
        h('span', { class: 'stat-label', text: '⏱️ ' + t('hoursLeft', { h: S.hoursLeft }) }),
        h('div', { class: 'bar' }, h('i', { style: 'width:' + (S.hoursLeft / S.hours * 100) + '%' }))),
      h('div', { class: 'stat' },
        h('span', { class: 'stat-label', text: '🛡️ ' + t('prep') + ': ' + pct + '%' }),
        h('div', { class: 'bar prep' }, h('i', { style: 'width:' + pct + '%' }))),
      h('div', { class: 'alert a-' + a, role: 'status' }, t(S.cfg.alert + 'Label') + ': ' + t(S.cfg.alert + '_' + a)));
  }

  /* ---------- phases ---------- */
  function render() {
    Cinematic.stop();
    var el = root(); el.innerHTML = '';
    if (S.phase === 'intro') return playIntro(el);
    if (S.phase === 'hub') return renderHub(el);
    if (S.phase === 'place') return renderPlace(el);
    if (S.phase === 'outro') return playOutro(el);
    if (S.phase === 'results') return renderResults(el);
  }

  function playIntro(el) {
    var panels = S.cfg.intro.map(function (p) { return { icon: p.icon, text: t(p.key, { h: S.hours }), scene: p.scene }; });
    panels[panels.length - 1].note = t('fiction');
    Cinematic.play(el, panels, function () { S.phase = 'hub'; render(); });
  }

  function renderHub(el) {
    el.appendChild(h('h2', { class: 'case-title', text: t(k('title')) }));
    el.appendChild(statusBar());
    if (S.bonus) el.appendChild(h('p', { class: 'pill bonus', text: '🎁 ' + t('bonusActive', { b: t('bonus_' + S.bonus) }) }));
    el.appendChild(h('p', { class: 'small', text: t('hubIntro') }));
    var grid = h('div', { class: 'places' });
    S.cfg.places.forEach(function (p) {
      var done = !!S.done[p.id], noTime = !done && S.hoursLeft < minCost(p);
      grid.appendChild(h('button', {
        class: 'place' + (done ? ' done' : '') + (noTime ? ' off' : ''), type: 'button',
        disabled: done || noTime, onclick: function () { S.phase = 'place'; S.placeId = p.id; S.ui = {}; render(); }
      },
        h('span', { class: 'place-icon', 'aria-hidden': 'true', text: p.icon }),
        h('span', { class: 'place-name', text: t(k(p.id + '_name')) }),
        h('span', { class: 'place-cost', text: done ? '✓ ' + t('done') : noTime ? t('notEnoughTime') : '⏱️ ' + costLabel(p) })));
    });
    el.appendChild(grid);

    // Case file (collected clues)
    var file = h('details', { class: 'casefile' }, h('summary', { text: '🗂️ ' + t('caseFile') + ' (' + S.clues.length + ')' }));
    if (!S.clues.length) file.appendChild(h('p', { class: 'small', text: t('caseFileEmpty') }));
    S.clues.forEach(function (c) {
      file.appendChild(h('div', { class: 'cf-item' }, h('b', { text: c.icon + ' ' + t(k(c.id + '_title')) }),
        h('p', { class: 'small', text: t(k(c.id + '_short'), c.vars) })));
    });
    el.appendChild(file);

    if (!doneOf(refugePlace())) el.appendChild(h('p', { class: 'warn small', text: t(k('noRefuge')) }));
    el.appendChild(h('button', { class: 'btn primary big', type: 'button', onclick: end, text: refugePlace().icon + ' ' + t(k('finish')) }));
  }

  function spend(hours) { S.hoursLeft = Math.max(0, S.hoursLeft - hours); }
  function backToHub() { if (S.hoursLeft <= 0) end(); else { S.phase = 'hub'; render(); window.scrollTo(0, 0); } }

  function placeHeader(el, p) {
    el.appendChild(statusBar());
    el.appendChild(h('div', { class: 'row between' },
      h('h2', { class: 'place-title' }, h('span', { 'aria-hidden': 'true', text: p.icon + ' ' }), t(k(p.id + '_name'))),
      S.done[p.id] ? null : h('button', { class: 'btn ghost', type: 'button', onclick: backToHub, text: t('back') })));
  }
  function continueBtn() {
    return h('button', { class: 'btn primary', type: 'button', onclick: backToHub, text: S.hoursLeft <= 0 ? t('timeUp') : t('continue') });
  }

  function renderPlace(el) {
    var p = place(S.placeId);
    placeHeader(el, p);
    var card = h('div', { class: 'card' }); el.appendChild(card);
    if (p.type === 'backpack') return backpack(card, p);
    if (p.type === 'clue') return clue(card, p);
    if (p.type === 'data') return dataClue(card, p);
    if (p.type === 'choice') return choice(card, p);
  }

  function backpack(card, p) {
    var d = S.done[p.id];
    card.appendChild(h('p', { text: t(k(p.id + '_text'), { n: slots(p) }) }));
    if (!d) {
      var sel = S.ui.sel || (S.ui.sel = []);
      card.appendChild(h('p', { class: 'pill', text: '🎒 ' + t('packSelected', { n: sel.length, max: slots(p) }) }));
      card.appendChild(h('div', { class: 'items' }, p.items.map(function (it) {
        var on = sel.indexOf(it.id) >= 0, full = !on && sel.length >= slots(p);
        return h('button', { class: 'item' + (on ? ' on' : ''), type: 'button', disabled: full, 'aria-pressed': on ? 'true' : 'false',
          onclick: function () { if (on) sel.splice(sel.indexOf(it.id), 1); else sel.push(it.id); render(); },
          text: (on ? '✓ ' : '') + t('item_' + it.id) });
      })));
      card.appendChild(h('button', { class: 'btn primary', type: 'button', disabled: !sel.length, onclick: function () {
        var okCount = sel.filter(function (id) { return p.items.filter(function (i) { return i.id === id; })[0].ok; }).length;
        S.done[p.id] = { sel: sel.slice(), okCount: okCount }; spend(p.cost); render();
      }, text: t('packConfirm') + ' (−' + p.cost + ' h)' }));
    } else {
      card.appendChild(h('p', { class: 'ok', text: t('packResult', { ok: d.okCount, max: slots(p) }) }));
      card.appendChild(h('ul', { class: 'fb-list' }, d.sel.map(function (id) {
        var ok = p.items.filter(function (i) { return i.id === id; })[0].ok;
        return h('li', { class: ok ? 'ok' : 'bad', text: (ok ? '✓ ' : '✗ ') + t('item_' + id) });
      })));
      if (d.okCount < d.sel.length) card.appendChild(h('p', { class: 'warn', text: t('packTipBad') }));
      card.appendChild(h('p', { class: 'small', text: t('packSource') }));
      card.appendChild(continueBtn());
    }
  }

  function clue(card, p) {
    var d = S.done[p.id];
    card.appendChild(h('h3', { text: t(k(p.id + '_title')) }));
    card.appendChild(h('blockquote', { class: 'quote', text: t(k(p.id + '_text')) }));
    card.appendChild(h('p', { class: 'small', text: t(k(p.id + '_source')) }));
    if (!d) {
      card.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: function () {
        S.done[p.id] = { saved: true }; S.clues.push({ id: p.id, icon: p.icon }); spend(p.cost); render();
      }, text: t('saveClue') + ' (−' + p.cost + ' h)' }));
    } else {
      card.appendChild(h('p', { class: 'ok', text: '✓ ' + t('clueSaved') }));
      card.appendChild(continueBtn());
    }
  }

  function dataClue(card, p) {
    var d = S.done[p.id];
    var m = Chart.mini(S.cfg.city, p.variable, p.season), r = m.info, tr = r.tr, right = App.verdict(tr);
    card.appendChild(h('h3', { text: t(k(p.id + '_title')) }));
    card.appendChild(h('p', { text: t(k(p.id + '_text')) }));
    card.appendChild(m.svg);
    card.appendChild(h('div', { class: 'nums' },
      h('span', null, t('rate') + ': ', h('b', { text: App.fmtRate(tr, p.variable) })),
      h('span', null, t('pvalue') + ': ', h('b', { text: App.fmtP(tr.p) })),
      h('span', null, t('yearsUsed') + ': ', h('b', { text: r.xs[0] + '–' + r.xs[r.xs.length - 1] }))));
    card.appendChild(h('p', { class: 'small', text: t('pReminder') }));
    card.appendChild(h('h3', { text: t('dataQ') }));
    var opts = [['up', 'opt_sigUp'], ['none', 'opt_none'], ['down', 'opt_sigDown']];
    card.appendChild(h('div', { class: 'options' }, opts.map(function (o) {
      var cls = 'opt' + (d && d.answer === o[0] ? (d.correct ? ' good' : ' bad') : '') + (d && !d.correct && o[0] === right ? ' good' : '');
      return h('button', { class: cls, type: 'button', disabled: !!d, onclick: function () {
        S.done[p.id] = { answer: o[0], correct: o[0] === right };
        S.clues.push({ id: p.id, icon: p.icon, vars: { rate: App.fmtRate(tr, p.variable), p: App.fmtP(tr.p) } });
        spend(p.cost); render();
      }, text: t(o[1]) });
    })));
    if (!d) card.appendChild(h('p', { class: 'small', text: t('answerCost', { h: p.cost }) }));
    if (d) {
      card.appendChild(h('p', { class: d.correct ? 'ok' : 'warn', text: (d.correct ? t('dataOk') : t('dataNo')) + ' ' +
        t(right === 'up' ? 'verdictUp' : right === 'down' ? 'verdictDown' : 'verdictNone') }));
      if (right === 'none') card.appendChild(h('p', { class: 'note', text: t('verdictNoneNote') }));
      card.appendChild(h('p', { text: t(k(p.id + '_after')) }));
    }
    card.appendChild(h('button', { class: 'btn ghost', type: 'button', onclick: function () {
      Archive.open({ city: S.cfg.city, variable: p.variable, season: p.season }, function () { App.show('level'); render(); }, 'backToCase');
    }, text: '📊 ' + t('openFull') }));
    if (d) card.appendChild(continueBtn());
  }

  function choice(card, p) {
    var d = S.done[p.id];
    card.appendChild(h('p', { text: t(k(p.id + '_text')) }));
    card.appendChild(h('h3', { text: t(k(p.id + '_q')) }));
    card.appendChild(h('div', { class: 'options' }, p.options.map(function (o) {
      var cost = o.cost !== undefined ? o.cost : p.cost;
      var tooLong = !d && cost > S.hoursLeft;
      var cls = 'opt' + (d && d.opt.id === o.id ? (o.pts === maxPts(p) ? ' good' : o.pts > 0 ? ' mid' : ' bad') : '');
      return h('button', { class: cls, type: 'button', disabled: !!d || tooLong, onclick: function () {
        S.done[p.id] = { opt: o }; spend(cost); render();
      }, text: t(k(p.id + '_opt_' + o.id)) + (cost > 0 ? ' (−' + cost + ' h)' : ' (0 h)') });
    })));
    if (d) {
      card.appendChild(h('p', { class: d.opt.pts === maxPts(p) ? 'ok' : d.opt.pts > 0 ? 'ok' : 'warn', text: t(k(p.id + '_fb_' + d.opt.id)) }));
      card.appendChild(continueBtn());
    }
  }
  function slots(p) { return p.slots + S.extraSlots; }
  function maxPts(p) { return Math.max.apply(null, p.options.map(function (o) { return o.pts; })); }

  /* ---------- ending ---------- */
  function end() {
    S.final = score(true);
    S.medal = medalFor(S.final.total);
    var best = App.store.get('best_' + S.cfg.id) || 0;
    if (S.final.total > best) App.store.set('best_' + S.cfg.id, S.final.total);
    if (S.medal !== 'none') App.store.set('bonus', { from: S.cfg.id, to: S.cfg.nextLevel, type: S.medal });
    S.phase = 'outro'; render(); window.scrollTo(0, 0);
  }

  function playOutro(el) {
    var ref = doneOf(refugePlace()), refOk = ref && ref.opt.good;
    var pack = doneOf(packPlace()), packOk = pack && pack.okCount >= 4;
    var hp = doneOf(helpPlace()), helped = hp && hp.opt.pts > 0;
    var I = S.cfg.outroIcons, sc = S.cfg.outroScenes || ['storm', 'storm', 'alert', 'calm', 'calm'];
    var panels = [
      { icon: I.out1, text: t(k('out1')), scene: sc[0] },
      { icon: I.out2, text: t(k('out2')), scene: sc[1] },
      { icon: refOk ? I.ref_ok : I.ref_bad, text: t(k(refOk ? 'out_ref_ok' : 'out_ref_bad')), scene: sc[2] },
      { icon: packOk ? I.pack_ok : I.pack_bad, text: t(k(packOk ? 'out_pack_ok' : 'out_pack_bad')), scene: sc[3] },
      { icon: helped ? I.help : I.end, text: t(k(helped ? 'out_help' : 'out_end')), scene: sc[4] }
    ];
    Cinematic.play(el, panels, function () { S.phase = 'results'; render(); window.scrollTo(0, 0); });
  }

  function renderResults(el) {
    var f = S.final, sc = S.cfg.scoring;
    el.appendChild(h('div', { class: 'card result-card' },
      h('p', { class: 'kicker', text: t(k('title')) }),
      h('div', { class: 'medal', 'aria-hidden': 'true', text: MEDAL_ICON[S.medal] }),
      h('h2', { text: t('medal_' + S.medal) }),
      h('p', { class: 'big-pct', text: f.total + '%' }),
      h('p', { class: 'small', text: t('prepLong') })));

    el.appendChild(h('div', { class: 'card' }, h('h3', { text: t('breakdown') }),
      Object.keys(sc).map(function (c) {
        return h('div', { class: 'brk' },
          h('div', { class: 'row between' }, h('span', { text: t('cat_' + c) }), h('b', { text: f.parts[c] + ' / ' + sc[c] })),
          h('div', { class: 'bar prep' }, h('i', { style: 'width:' + (f.parts[c] / sc[c] * 100) + '%' })));
      })));

    el.appendChild(h('div', { class: 'card' }, h('h3', { text: '🎁 ' + t('bonusTitle') }),
      h('p', { text: t('bonus_' + S.medal) }), S.medal !== 'none' && S.cfg.nextLevel ? h('p', { class: 'small', text: t('bonusNote', { c: t('case_' + S.cfg.nextLevel) }) }) : null));

    var learned = S.cfg.places.filter(function (p) { return p.type === 'data'; }).map(function (p) {
      var r = App.trendFor(S.cfg.city, p.variable, p.season), vd = App.verdict(r.tr);
      return h('li', { text: t('learnedLine', {
        city: App.data.cities[S.cfg.city].name, variable: t('var_' + p.variable), season: t('season_' + p.season), y0: r.xs[0], y1: r.xs[r.xs.length - 1],
        rate: App.fmtRate(r.tr, p.variable), p: App.fmtP(r.tr.p), verdict: t('short_' + vd) }) });
    });
    el.appendChild(h('div', { class: 'card' }, h('h3', { text: '🛰️ ' + t('learnedTitle') }), h('ul', null, learned)));

    el.appendChild(h('div', { class: 'card' }, h('h3', { text: '✅ ' + t('actionsTitle') }),
      h('ul', null, [1, 2, 3, 4, 5].map(function (i) { return h('li', { text: t(k('act' + i)) }); }))));

    el.appendChild(h('div', { class: 'card stack' },
      h('button', { class: 'btn primary big', type: 'button', onclick: share, text: '📤 ' + t('shareBtn') }),
      S.cfg.nextLevel && window.LEVELS[S.cfg.nextLevel] ? h('button', { class: 'btn primary', type: 'button', onclick: function () { Level.start(S.cfg.nextLevel); }, text: '➡️ ' + t('nextCase', { c: t('case_' + S.cfg.nextLevel) }) }) : null,
      h('button', { class: 'btn', type: 'button', onclick: function () { Level.start(S.cfg.id, true); }, text: '🔁 ' + t('retry') }),
      h('button', { class: 'btn', type: 'button', onclick: function () {
        Archive.open({ city: S.cfg.city }, function () { App.show('level'); render(); }, 'backToCase');
      }, text: '📊 ' + t('openArchive') }),
      h('button', { class: 'btn ghost', type: 'button', onclick: function () { Home.show(); }, text: t('home') })));
  }

  /* ---------- shareable card (PNG) ---------- */
  function wrap(ctx, text, x, y, maxW, lh) {
    var words = text.split(' '), line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; } else line = test;
    });
    if (line) ctx.fillText(line, x, y);
    return y + lh;
  }
  function makeCard() {
    var c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 1350); g.addColorStop(0, '#0f1b2d'); g.addColorStop(1, '#1d3b66');
    x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
    x.textAlign = 'center';
    x.fillStyle = '#ffb703'; x.font = 'bold 72px system-ui, sans-serif'; x.fillText(t('title'), 540, 150);
    x.fillStyle = '#9fb3cf'; x.font = '44px system-ui, sans-serif'; x.fillText(t(k('title')), 540, 230);
    x.font = '220px system-ui, sans-serif'; x.fillText(MEDAL_ICON[S.medal], 540, 510);
    x.fillStyle = '#eaf1fb'; x.font = 'bold 64px system-ui, sans-serif'; x.fillText(t('medal_' + S.medal), 540, 620);
    x.fillStyle = '#06d6a0'; x.font = 'bold 160px system-ui, sans-serif'; x.fillText(S.final.total + '%', 540, 800);
    x.fillStyle = '#9fb3cf'; x.font = '40px system-ui, sans-serif'; x.fillText(t('prep'), 540, 860);
    var r = App.trendFor(S.cfg.city, 't2m', 'annual');
    x.fillStyle = '#eaf1fb'; x.font = '42px system-ui, sans-serif';
    var y = wrap(x, t('cardFact', { city: App.data.cities[S.cfg.city].name, rate: App.fmtRate(r.tr, 't2m'), y0: r.xs[0], y1: r.xs[r.xs.length - 1] }), 540, 980, 900, 56);
    x.fillStyle = '#ffb703'; x.font = 'bold 44px system-ui, sans-serif'; wrap(x, t('cardCta'), 540, y + 40, 900, 56);
    x.fillStyle = '#9fb3cf'; x.font = '30px system-ui, sans-serif'; x.fillText('yair-naran.github.io/detective-climatico', 540, 1290);
    return c;
  }
  function share() {
    var c = makeCard(), text = t('shareText', { pct: S.final.total });
    c.toBlob(function (blob) {
      var file = new File([blob], 'detective-climatico.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], text: text, url: location.origin + location.pathname }).catch(function () {});
      } else {
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'detective-climatico.png';
        document.body.appendChild(a); a.click(); a.remove();
      }
    }, 'image/png');
  }

  /* ---------- public ---------- */
  window.Level = {
    start: function (id, skipIntro) {
      var cfg = window.LEVELS[id];
      S = { cfg: cfg, hours: cfg.hours, hoursLeft: cfg.hours, done: {}, clues: [], phase: skipIntro ? 'hub' : 'intro', ui: {}, extraSlots: 0, bonus: null };
      // Bonus earned in the previous case (gold: +2 backpack slots, silver: +1 hour, bronze: first clue for free)
      var b = App.store.get('bonus');
      if (b && b.to === id) {
        S.bonus = b.type;
        if (b.type === 'gold') S.extraSlots = 2;
        if (b.type === 'silver') { S.hours += 1; S.hoursLeft += 1; }
        if (b.type === 'bronze') {
          var c = cfg.places.filter(function (p) { return p.type === 'clue'; })[0];
          if (c) { S.done[c.id] = { saved: true, free: true }; S.clues.push({ id: c.id, icon: c.icon }); }
        }
      }
      App.show('level'); render();
    },
    init: function () { App.onLang(function () { if (App.current === 'level' && S) render(); }); },
    _state: function () { return S; }
  };
})();
