/* Level engine: intro cinematic -> hub (time-limited exploration) -> places -> outro cinematic -> results.
   Text keys: <level>_<place>_name/_text/_title/_short/_q/_opt_<id>/_fb_<id>/_after (see i18n/strings.js). */
(function () {
  'use strict';
  var h = function () { return App.h.apply(null, arguments); };
  var t = function (k, v) { return App.t(k, v); };
  var S = null; // level state

  function root() { return document.getElementById('screen-level'); }
  function k(suffix) { return S.cfg.id + '_' + suffix; }
  /* level-specific text if it exists, otherwise the generic key */
  function lt(suffix, generic, vars) { var key = k(suffix); return App.has(key) ? t(key, vars) : t(generic, vars); }
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
      if (p.type === 'backpack') r.backpack = d.pts;
      else if (p.type === 'clue') r.info += p.points;
      else if (p.type === 'data') r.info += (d.correct ? (S.cfg.quiz ? p.points - 2 : p.points) : (S.cfg.dataWrongPts || 0)) + (d.quiz && d.quiz.ok ? 2 : 0);
      else if (p.type === 'choice') r[p.cat] = d.opt.pts;
    });
    r.info = Math.min(r.info, sc.info);
    if (final && !doneOf(refugePlace())) r.refuge = S.cfg.refugeFallback;
    var total = 0; Object.keys(r).forEach(function (c) { total += r[c]; });
    return { parts: r, total: Math.round(total) };
  }
  /* backpack: value of what you packed vs. the best possible pack with the base slots (bonus slots can only help) */
  function itemOf(p, id) { return p.items.filter(function (i) { return i.id === id; })[0]; }
  function packPoints(p, sel) {
    var best = p.items.map(function (i) { return i.v; }).filter(function (v) { return v > 0; }).sort(function (a, b) { return b - a; })
      .slice(0, p.slots).reduce(function (a, b) { return a + b; }, 0);
    var got = sel.reduce(function (a, id) { return a + itemOf(p, id).v; }, 0);
    return Math.max(0, Math.min(S.cfg.scoring.backpack, Math.round(got / best * S.cfg.scoring.backpack)));
  }
  function tagOf(v) { return v >= 3 ? 'vital' : v === 2 ? 'useful' : v === 1 ? 'meh' : v === 0 ? 'useless' : 'risky'; }

  function medalFor(pct) {
    var m = S.cfg.medals;
    return pct >= m.gold ? 'gold' : pct >= m.silver ? 'silver' : pct >= m.bronze ? 'bronze' : 'none';
  }
  var ENDING_ICON = { legend: '🏆', gossip: '📢', lucky: '🍀', tourist: '🧳', scientist: '🔬', hero: '🤝', rookie: '🔎' };
  var MEDAL_COLOR = { gold: '#f2c14e', silver: '#d5dde6', bronze: '#d98a52', none: '#92c5de' };

  function alertLevel() {
    var f = S.hoursLeft / S.hours;
    return f > 0.8 ? 'blue' : f > 0.6 ? 'green' : f > 0.4 ? 'yellow' : f > 0.2 ? 'orange' : 'red';
  }

  /* ---------- top status bar ---------- */
  function statusBar() {
    var a = alertLevel(), pct = score(false).total;
    return h('div', { class: 'status' },
      h('div', { class: 'stat' },
        h('span', { class: 'stat-label' }, Icons.label('⏱️', t('hoursLeft', { h: S.hoursLeft }))),
        h('div', { class: 'bar' }, h('i', { style: 'width:' + (S.hoursLeft / S.hours * 100) + '%' }))),
      h('div', { class: 'stat' },
        h('span', { class: 'stat-label' }, Icons.label('🛡️', t('prep') + ': ' + pct + '%')),
        h('div', { class: 'bar prep' }, h('i', { style: 'width:' + pct + '%' }))),
      h('div', { class: 'alert a-' + a, role: 'status' }, t(S.cfg.alert + 'Label') + ': ' + t(S.cfg.alert + '_' + a)));
  }

  /* ---------- phases ---------- */
  function render() {
    Cinematic.stop();
    document.body.setAttribute('data-zone', S.cfg.id);
    var el = root(); el.innerHTML = '';
    var view = S.phase + ':' + (S.placeId || '');
    if (view !== S.view) { S.view = view; if (window.Motion) Motion.enter(el); }
    if (S.phase === 'intro') return playIntro(el);
    if (S.phase === 'hub') return renderHub(el);
    if (S.phase === 'place') return renderPlace(el);
    if (S.phase === 'event') return renderEvent(el);
    if (S.phase === 'outro') return playOutro(el);
    if (S.phase === 'results') return renderResults(el);
  }

  function playIntro(el) {
    var panels = S.cfg.intro.map(function (p) { return { icon: p.icon, text: t(p.key, { h: S.hours }), scene: p.scene }; });
    panels[panels.length - 1].note = t('fiction');
    Cinematic.play(el, panels, function () { S.phase = 'hub'; render(); }, 0, S.cfg.id);
  }

  function renderHub(el) {
    el.appendChild(h('div', { class: 'hub-head' },
      h('h2', { class: 'case-title', text: t(k('title')) }),
      h('div', { class: 'hub-strip', 'aria-hidden': 'true' }, Stripes.strip(S.cfg.city))));
    el.appendChild(statusBar());
    if (S.bonus) el.appendChild(h('p', { class: 'pill bonus' }, Icons.label('🎁', t('bonusActive', { b: t('bonus_' + S.bonus) }))));
    el.appendChild(h('p', { class: 'small', text: t('hubIntro') }));
    var grid = h('div', { class: 'places' });
    S.cfg.places.forEach(function (p) {
      var done = !!S.done[p.id], noTime = !done && S.hoursLeft < minCost(p);
      grid.appendChild(h('button', {
        class: 'place tilt' + (done ? ' done' : '') + (noTime ? ' off' : ''), type: 'button',
        disabled: done || noTime, onclick: function () { S.phase = 'place'; S.placeId = p.id; S.ui = {}; render(); }
      },
        h('span', { class: 'place-icon', 'aria-hidden': 'true' }, Icons.el(p.icon)),
        h('span', { class: 'place-name', text: t(k(p.id + '_name')) }),
        h('span', { class: 'place-cost' }, done ? Icons.label('✓', t('done')) : noTime ? t('notEnoughTime') : Icons.label('⏱️', costLabel(p)))));
    });
    el.appendChild(grid);

    // Case file (collected clues)
    var file = h('details', { class: 'casefile' }, h('summary', null, Icons.label('🗂️', t('caseFile') + ' (' + S.clues.length + ')')));
    if (!S.clues.length) file.appendChild(h('p', { class: 'small', text: t('caseFileEmpty') }));
    S.clues.forEach(function (c) {
      file.appendChild(h('div', { class: 'cf-item' }, h('b', null, Icons.label(c.icon, t(k(c.id + '_title')))),
        h('p', { class: 'small', text: t(k(c.id + '_short'), c.vars) })));
    });
    el.appendChild(file);
    el.appendChild(h('button', { class: 'btn ghost', type: 'button', onclick: openGloss }, Icons.label('📖', t('glossBtn'))));

    if (!doneOf(refugePlace())) el.appendChild(h('p', { class: 'warn small', text: t(k('noRefuge')) }));
    el.appendChild(h('button', { class: 'btn big-2 finish', type: 'button', onclick: end }, Icons.label(refugePlace().icon, t(k('finish')))));
  }

  function spend(hours) { S.hoursLeft = Math.max(0, S.hoursLeft - hours); }
  function openGloss() { Glossary.open(function () { App.show('level'); render(); }); }
  function backToHub() {
    if (S.hoursLeft <= 0) return end();
    S.phase = (S.cfg.event && !S.event && S.hours - S.hoursLeft >= 3) ? 'event' : 'hub';
    S.ui = {}; render(); window.scrollTo(0, 0);
  }

  /* surprise event: one per case, a quick choice where the wrong option costs time */
  function renderEvent(el) {
    var ev = S.cfg.event, d = S.event;
    el.appendChild(statusBar());
    var card = h('div', { class: 'card event' });
    card.appendChild(h('div', { class: 'event-head' },
      h('span', { class: 'event-icon', 'aria-hidden': 'true' }, Icons.el(ev.icon)),
      h('h2', { text: t(k('ev_title')) }),
      h('span', { class: 'badge badge-warn' }, Icons.label('⚡', t('eventKicker')))));
    card.appendChild(h('p', { text: t(k('ev_text')) }));
    card.appendChild(h('div', { class: 'options' }, ev.options.map(function (o) {
      var cls = 'opt' + (d && d.id === o.id ? (o.good ? ' good' : ' bad') : '');
      return h('button', { class: cls, type: 'button', disabled: !!d, onclick: function () {
        S.event = { id: o.id, good: !!o.good }; spend(o.cost); render();
      }, text: t(k('ev_opt_' + o.id)) + (o.cost > 0 ? ' (−' + o.cost + ' h)' : ' (0 h)') });
    })));
    if (d) {
      card.appendChild(h('p', { class: d.good ? 'ok' : 'warn', text: t(k('ev_fb_' + d.id)) }));
      card.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: function () {
        if (S.hoursLeft <= 0) end(); else { S.phase = 'hub'; render(); window.scrollTo(0, 0); }
      }, text: S.hoursLeft <= 0 ? t('timeUp') : t('continue') }));
    }
    el.appendChild(card);
  }

  function placeHeader(el, p) {
    el.appendChild(statusBar());
    el.appendChild(h('div', { class: 'row between' },
      h('h2', { class: 'place-title' }, h('span', { class: 'place-icon sm', 'aria-hidden': 'true' }, Icons.el(p.icon)), t(k(p.id + '_name'))),
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
      card.appendChild(h('p', { class: 'small', text: t('packHint') }));
      card.appendChild(h('p', { class: 'pill' }, Icons.label('🎒', t('packSelected', { n: sel.length, max: slots(p) }))));
      card.appendChild(h('div', { class: 'items' }, p.items.map(function (it) {
        var on = sel.indexOf(it.id) >= 0, full = !on && sel.length >= slots(p);
        return h('button', { class: 'item' + (on ? ' on' : ''), type: 'button', disabled: full, 'aria-pressed': on ? 'true' : 'false', 'data-item': it.id,
          onclick: function () { if (on) sel.splice(sel.indexOf(it.id), 1); else sel.push(it.id); render(); },
        }, on ? Icons.el('✓') : null, t('item_' + it.id));
      })));
      card.appendChild(h('button', { class: 'btn primary', type: 'button', disabled: !sel.length, onclick: function () {
        S.done[p.id] = { sel: sel.slice(), pts: packPoints(p, sel) }; spend(p.cost); render();
      }, text: t('packConfirm') + ' (−' + p.cost + ' h)' }));
    } else {
      card.appendChild(h('p', { class: d.pts >= 24 ? 'ok' : d.pts >= 15 ? 'warn' : 'bad', text: t('packScore', { pts: d.pts, max: S.cfg.scoring.backpack }) }));
      card.appendChild(h('ul', { class: 'fb-list' }, d.sel.map(function (id) {
        var v = itemOf(p, id).v, tag = tagOf(v);
        return h('li', { class: 'fb-item ' + tag },
          h('span', { class: 'tag t-' + tag, text: t('tag_' + tag) }), h('b', { text: ' ' + t('item_' + id) }),
          h('span', { class: 'small fb-text', text: ' ' + lt('itemfb_' + id, 'itemfb_' + id) }));
      })));
      var missing = p.items.filter(function (i) { return i.v >= 3 && d.sel.indexOf(i.id) < 0; });
      if (missing.length) card.appendChild(h('p', { class: 'warn', text: t('packMissing', { list: missing.map(function (i) { return t('item_' + i.id); }).join(', ') }) }));
      card.appendChild(h('p', { class: 'small', text: lt(p.id + '_source', 'packSource') }));
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
      card.appendChild(h('p', { class: 'ok' }, Icons.label('✓', t('clueSaved'))));
      card.appendChild(continueBtn());
    }
  }

  /* second question (harder cases): projection for real trends, meaning of p > 0.05 otherwise */
  function quizFor(p, tr, right) {
    var idx = S.cfg.places.indexOf(p), unit = t('unit_' + p.variable);
    var f = function (x) { return (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(1) + ' ' + unit; };
    var opts;
    if (right === 'none') {
      opts = [{ id: 'ok', text: t('quizNone_ok'), ok: true }, { id: 'proof', text: t('quizNone_proof') }, { id: 'peak', text: t('quizNone_peak') }];
      return { q: t('quizNoneQ'), opts: rotate(opts, idx), fbOk: t('quizNoneOk'), fbNo: t('quizNoneNo') };
    }
    var dec = tr.slopePerDecade;
    opts = [{ id: 'x3', text: f(3 * dec), ok: true }, { id: 'x1', text: f(dec) }, { id: 'x30', text: f(30 * dec) }];
    return { q: t('quizProjQ'), opts: rotate(opts, idx), fbOk: t('quizProjOk', { val: f(3 * dec) }), fbNo: t('quizProjNo', { val: f(3 * dec), rate: f(dec) }) };
  }
  function rotate(a, n) { n = n % a.length; return a.slice(n).concat(a.slice(0, n)); }

  function dataClue(card, p) {
    var d = S.done[p.id];
    var m = Chart.mini(S.cfg.city, p.variable, p.season, p.chart), r = m.info, tr = r.tr, right = App.verdict(tr);
    card.appendChild(h('h3', { text: t(k(p.id + '_title')) }));
    card.appendChild(h('p', { text: t(k(p.id + '_text')) }));
    card.appendChild(h('p', { class: 'badge' }, Icons.label('📊', t('chartType_' + (p.chart || 'line')))));
    card.appendChild(m.svg);
    card.appendChild(m.legend);
    card.appendChild(h('div', { class: 'nums' },
      h('span', null, t('rate') + ': ', h('b', { text: App.fmtRate(tr, p.variable) })),
      h('span', null, t('pvalue') + ': ', h('b', { text: App.fmtP(tr.p) })),
      h('span', null, t('yearsUsed') + ': ', h('b', { text: r.xs[0] + '–' + r.xs[r.xs.length - 1] }))));
    card.appendChild(h('p', { class: 'small', text: t('pReminder') }));
    card.appendChild(h('h3', { text: t('dataQ') }));
    var opts = [['up', 'opt_sigUp'], ['none', 'opt_none'], ['down', 'opt_sigDown']];
    card.appendChild(h('div', { class: 'options' }, opts.map(function (o) {
      var cls = 'opt' + (d && d.answer === o[0] ? (d.correct ? ' good' : ' bad') : '') + (d && !d.correct && o[0] === right ? ' good' : '');
      return h('button', { class: cls, type: 'button', disabled: !!d, 'data-ans': o[0], onclick: function () {
        S.done[p.id] = { answer: o[0], correct: o[0] === right };
        S.clues.push({ id: p.id, icon: p.icon, vars: { rate: App.fmtRate(tr, p.variable), p: App.fmtP(tr.p) } });
        spend(p.cost); render();
      }, text: t(o[1]) });
    })));
    if (!d) card.appendChild(h('p', { class: 'small', text: t('answerCost', { h: p.cost }) }));
    var ready = d && (!S.cfg.quiz || d.quiz);
    if (d) {
      card.appendChild(h('p', { class: d.correct ? 'ok' : 'warn', text: (d.correct ? t('dataOk') : t('dataNo')) + ' ' +
        t(right === 'up' ? 'verdictUp' : right === 'down' ? 'verdictDown' : 'verdictNone') }));
      if (right === 'none') card.appendChild(h('p', { class: 'note', text: t('verdictNoneNote') }));
      if (S.cfg.quiz) {
        var qz = quizFor(p, tr, right);
        card.appendChild(h('h3', null, Icons.label('🧠', t('quizKicker'))));
        card.appendChild(h('p', { text: qz.q }));
        card.appendChild(h('div', { class: 'options' }, qz.opts.map(function (o) {
          var cls = 'opt' + (d.quiz && d.quiz.id === o.id ? (o.ok ? ' good' : ' bad') : '') + (d.quiz && !d.quiz.ok && o.ok ? ' good' : '');
          return h('button', { class: cls, type: 'button', disabled: !!d.quiz, 'data-quiz': o.ok ? 'ok' : 'no', onclick: function () {
            d.quiz = { id: o.id, ok: !!o.ok }; render();
          }, text: o.text });
        })));
        if (d.quiz) card.appendChild(h('p', { class: d.quiz.ok ? 'ok' : 'warn', text: d.quiz.ok ? qz.fbOk : qz.fbNo }));
      }
      if (ready) {
        var maxI = r.ys.indexOf(Math.max.apply(null, r.ys)), minI = r.ys.indexOf(Math.min.apply(null, r.ys));
        card.appendChild(h('p', { text: t(k(p.id + '_after'), { maxY: r.xs[maxI], minY: r.xs[minI] }) }));
      }
    }
    card.appendChild(h('div', { class: 'row wrap' },
      h('button', { class: 'btn ghost', type: 'button', onclick: function () {
        Archive.open({ city: S.cfg.city, variable: p.variable, season: p.season, chart: p.chart }, function () { App.show('level'); render(); }, 'backToCase');
      } }, Icons.label('📊', t('openFull'))),
      h('button', { class: 'btn ghost', type: 'button', onclick: openGloss }, Icons.label('📖', t('glossWhat')))));
    if (ready) card.appendChild(continueBtn());
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
  function endingFor() {
    var sh = doneOf(byRole(function (p) { return p.cat === 'share'; })), ref = doneOf(refugePlace()), pack = doneOf(packPlace());
    var hp = doneOf(helpPlace()), helped = hp && hp.opt.pts > 0;
    var dataAll = S.cfg.places.filter(function (p) { return p.type === 'data'; }).every(function (p) {
      var d = S.done[p.id]; return d && d.correct && (!S.cfg.quiz || (d.quiz && d.quiz.ok));
    });
    if (S.medal === 'gold' && dataAll && helped) return 'legend';
    if (sh && sh.opt.pts === 0) return 'gossip';
    if (!(ref && ref.opt.good)) return 'lucky';
    if (!pack || pack.pts < 22) return 'tourist';
    if (dataAll && S.final.total < S.cfg.medals.silver) return 'scientist';
    if (helped && (S.medal === 'gold' || S.medal === 'silver')) return 'hero';
    return 'rookie';
  }

  function end() {
    S.final = score(true);
    S.medal = medalFor(S.final.total);
    S.ending = endingFor();
    var seen = App.store.get('endings_' + S.cfg.id) || [];
    S.newEnding = seen.indexOf(S.ending) < 0;
    if (S.newEnding) { seen.push(S.ending); App.store.set('endings_' + S.cfg.id, seen); }
    var best = App.store.get('best_' + S.cfg.id) || 0;
    if (S.final.total > best) App.store.set('best_' + S.cfg.id, S.final.total);
    if (S.medal !== 'none' && S.cfg.nextLevel) App.store.set('bonus', { from: S.cfg.id, to: S.cfg.nextLevel, type: S.medal });
    S.phase = 'outro'; render(); window.scrollTo(0, 0);
  }

  function playOutro(el) {
    var ref = doneOf(refugePlace()), refOk = ref && ref.opt.good;
    var pack = doneOf(packPlace());
    var packOk = pack && pack.pts >= 22;
    var hp = doneOf(helpPlace()), helped = hp && hp.opt.pts > 0;
    var I = S.cfg.outroIcons, sc = S.cfg.outroScenes || ['storm', 'storm', 'alert', 'calm', 'calm'];
    var panels = [
      { icon: I.out1, text: t(k('out1')), scene: sc[0] },
      { icon: I.out2, text: t(k('out2')), scene: sc[1] },
      { icon: refOk ? I.ref_ok : I.ref_bad, text: t(k(refOk ? 'out_ref_ok' : 'out_ref_bad')), scene: sc[2] },
      { icon: packOk ? I.pack_ok : I.pack_bad, text: t(k(packOk ? 'out_pack_ok' : 'out_pack_bad')), scene: sc[3] },
      { icon: helped ? I.help : I.end, text: t(k(helped ? 'out_help' : 'out_end')), scene: sc[4] }
    ];
    Cinematic.play(el, panels, function () { S.phase = 'results'; render(); window.scrollTo(0, 0); }, 0, S.cfg.id);
  }

  function renderResults(el) {
    var f = S.final, sc = S.cfg.scoring;
    el.appendChild(h('div', { class: 'card result-card' },
      h('div', { class: 'rc-strip', 'aria-hidden': 'true' }, Stripes.strip(S.cfg.city)),
      h('div', { class: 'medal', 'aria-hidden': 'true' }, Icons.medal(S.medal)),
      h('h2', { text: t('medal_' + S.medal) }),
      h('p', { class: 'big-pct', text: f.total + '%' }),
      h('p', { class: 'small', text: t('prepLong') }),
      h('p', { class: 'rc-case', text: t(k('title')) })));

    var seen = (App.store.get('endings_' + S.cfg.id) || []).length;
    el.appendChild(h('div', { class: 'card ending e-' + S.ending },
      h('div', { class: 'ending-row' },
        h('span', { class: 'ending-icon', 'aria-hidden': 'true' }, Icons.el(ENDING_ICON[S.ending])),
        h('h2', { text: t('end_' + S.ending) }),
        h('span', { class: 'badge' + (S.newEnding ? ' badge-new' : '') }, S.newEnding ? Icons.label('✨', t('endingNew')) : t('endingKicker'))),
      h('p', { text: t(k('end_' + S.ending)) }),
      h('p', { class: 'small', text: t('endingCount', { n: seen, total: window.ENDINGS.length }) + (seen < window.ENDINGS.length ? ' ' + t('endingTry') : ' ' + t('endingAll')) })));

    el.appendChild(h('div', { class: 'card' }, h('h3', { text: t('breakdown') }),
      Object.keys(sc).map(function (c) {
        return h('div', { class: 'brk' },
          h('div', { class: 'row between' }, h('span', { text: lt('cat_' + c, 'cat_' + c) }), h('b', { text: f.parts[c] + ' / ' + sc[c] })),
          h('div', { class: 'bar prep' }, h('i', { style: 'width:' + (f.parts[c] / sc[c] * 100) + '%' })));
      })));

    if (!S.cfg.nextLevel) el.appendChild(h('div', { class: 'card' }, h('h3', null, Icons.label('🏆', t('allDoneTitle'))), h('p', { text: t('allDone') })));
    else el.appendChild(h('div', { class: 'card' }, h('h3', null, Icons.label('🎁', t('bonusTitle'))),
      h('p', { text: t('bonus_' + S.medal) }), S.medal !== 'none' && S.cfg.nextLevel ? h('p', { class: 'small', text: t('bonusNote', { c: t('case_' + S.cfg.nextLevel) }) }) : null));

    var learned = S.cfg.places.filter(function (p) { return p.type === 'data'; }).map(function (p) {
      var r = App.trendFor(S.cfg.city, p.variable, p.season), vd = App.verdict(r.tr);
      return h('li', { text: t('learnedLine', {
        city: App.data.cities[S.cfg.city].name, variable: t('var_' + p.variable), season: t('season_' + p.season), y0: r.xs[0], y1: r.xs[r.xs.length - 1],
        rate: App.fmtRate(r.tr, p.variable), p: App.fmtP(r.tr.p), verdict: t('short_' + vd) }) });
    });
    el.appendChild(h('div', { class: 'card' }, h('h3', null, Icons.label('🛰️', t('learnedTitle'))), h('ul', null, learned)));

    el.appendChild(h('div', { class: 'card' }, h('h3', null, Icons.label('✅', t('actionsTitle'))),
      h('ul', null, [1, 2, 3, 4, 5].map(function (i) { return h('li', { text: t(k('act' + i)) }); }))));

    el.appendChild(h('div', { class: 'card stack' },
      h('button', { class: 'btn primary big', type: 'button', onclick: share }, Icons.label('📤', t('shareBtn'))),
      S.cfg.nextLevel && window.LEVELS[S.cfg.nextLevel] ? h('button', { class: 'btn primary', type: 'button', onclick: function () { Level.start(S.cfg.nextLevel); } }, Icons.label('➡️', t('nextCase', { c: t('case_' + S.cfg.nextLevel) }))) : null,
      h('button', { class: 'btn', type: 'button', onclick: function () { Level.start(S.cfg.id, true); } }, Icons.label('🔁', t('retry'))),
      h('button', { class: 'btn', type: 'button', onclick: function () {
        Archive.open({ city: S.cfg.city }, function () { App.show('level'); render(); }, 'backToCase');
      } }, Icons.label('📊', t('openArchive'))),
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
    var x = c.getContext('2d'), D = '"Archivo", system-ui, sans-serif', B = '"Atkinson Hyperlegible Next", system-ui, sans-serif';
    x.fillStyle = '#0e1116'; x.fillRect(0, 0, 1080, 1350);
    // the case city's real temperature stripes across the top
    var st = Stripes.series(S.cfg.city), m = Math.max.apply(null, st.anom.map(Math.abs)) || 1, w = 1080 / st.anom.length;
    st.anom.forEach(function (a, i) { x.fillStyle = Stripes.color(a / m); x.fillRect(Math.floor(i * w), 0, Math.ceil(w) + 1, 300); });
    x.fillStyle = '#0e1116'; x.fillRect(0, 300, 1080, 6);
    x.textAlign = 'left';
    x.fillStyle = 'rgba(14,17,22,.82)'; x.fillRect(60, 236, 420, 48);
    x.fillStyle = '#f3f5f8'; x.font = '600 26px ' + D; x.fillText(App.data.cities[S.cfg.city].name + ' · ' + st.years[0] + '–' + st.years[st.years.length - 1], 80, 269);
    x.textAlign = 'center';
    x.fillStyle = '#f3f5f8'; x.font = 'bold 76px ' + D; x.fillText(t('title'), 540, 410);
    x.fillStyle = '#a7b0bc'; x.font = '40px ' + B; x.fillText(t(k('title')), 540, 470);
    // medal
    var MC = MEDAL_COLOR[S.medal];
    x.beginPath(); x.arc(540, 610, 92, 0, Math.PI * 2); x.fillStyle = MC; x.fill();
    x.lineWidth = 10; x.strokeStyle = 'rgba(0,0,0,.25)'; x.stroke();
    x.fillStyle = '#0e1116'; x.font = 'bold 84px ' + D; x.fillText(S.final.total + '%', 540, 640);
    x.fillStyle = '#f3f5f8'; x.font = 'bold 60px ' + D; x.fillText(t('medal_' + S.medal), 540, 830);
    x.fillStyle = '#f4a582'; x.font = '38px ' + B; x.fillText(t('endingKicker') + ': ' + t('end_' + S.ending), 540, 892);
    x.fillStyle = '#a7b0bc'; x.font = '34px ' + B; x.fillText(t('prep'), 540, 748);
    var r = App.trendFor(S.cfg.city, 't2m', 'annual');
    x.fillStyle = '#f3f5f8'; x.font = '42px ' + B;
    var y = wrap(x, t('cardFact', { city: App.data.cities[S.cfg.city].name, rate: App.fmtRate(r.tr, 't2m'), y0: r.xs[0], y1: r.xs[r.xs.length - 1] }), 540, 1010, 900, 56);
    x.fillStyle = '#92c5de'; x.font = 'bold 44px ' + D; wrap(x, t('cardCta'), 540, y + 40, 900, 56);
    x.fillStyle = '#a7b0bc'; x.font = '30px ' + B; x.fillText('yair-naran.github.io/detective-climatico', 540, 1290);
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
      S = { cfg: cfg, hours: cfg.hours, hoursLeft: cfg.hours, done: {}, clues: [], phase: skipIntro ? 'hub' : 'intro', ui: {}, extraSlots: 0, bonus: null, event: null };
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
