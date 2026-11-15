/* Original generative music and sound effects, synthesized live with the Web Audio API.
   No samples, no audio files, no third-party music: nothing here can carry a copyright claim.
   Starts muted (browsers block autoplay anyway). Each zone has its own scale, tempo and ambience:
   home = calm pentatonic, costa = bright waves, centro = warm dorian shimmer, norte = low wind and minor. */
(function () {
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master, music, sfxBus, delay, amb, ambGain, ambFilter, on = false, zone = 'home', timer = null, beat = 0, idx = 2;
  var ZONES = {
    home:   { root: 146.83, scale: [0, 2, 4, 7, 9, 12],      chords: [[0, 7, 12], [-3, 4, 9], [-5, 2, 7], [-2, 5, 9]], bpm: 46, wave: 'sine',     pad: 'triangle', amb: { f: 500, q: 0.4, g: 0.015, type: 'lowpass' } },
    costa:  { root: 196.00, scale: [0, 2, 4, 6, 7, 9, 11],   chords: [[0, 7, 11], [2, 9, 14], [-5, 4, 7], [4, 11, 14]], bpm: 58, wave: 'triangle', pad: 'sine',     amb: { f: 700, q: 0.5, g: 0.05, type: 'lowpass', lfo: 0.11 } },
    centro: { root: 174.61, scale: [0, 2, 3, 5, 7, 9, 10],   chords: [[0, 7, 10], [-2, 5, 10], [-4, 3, 7], [-2, 7, 12]], bpm: 42, wave: 'triangle', pad: 'sawtooth', amb: { f: 3200, q: 4, g: 0.012, type: 'bandpass', lfo: 0.07 } },
    norte:  { root: 130.81, scale: [0, 3, 5, 7, 10, 12],     chords: [[0, 7, 12], [-4, 3, 10], [-7, 0, 7], [-2, 5, 10]], bpm: 38, wave: 'sine',     pad: 'triangle', amb: { f: 420, q: 6, g: 0.06, type: 'bandpass', lfo: 0.16 } }
  };
  var tone = function (root, semis) { return root * Math.pow(2, semis / 12); };

  function build() {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    delay = ctx.createDelay(1.5); delay.delayTime.value = 0.46;
    var fb = ctx.createGain(); fb.gain.value = 0.36;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1700;
    delay.connect(lp); lp.connect(fb); fb.connect(delay);
    var wet = ctx.createGain(); wet.gain.value = 0.55; lp.connect(wet); wet.connect(master);
    music = ctx.createGain(); music.gain.value = 0.85; music.connect(master); music.connect(delay);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.55; sfxBus.connect(master);
    // ambience: looping filtered noise (waves, wind, heat shimmer)
    var len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    amb = ctx.createBufferSource(); amb.buffer = buf; amb.loop = true;
    ambFilter = ctx.createBiquadFilter(); ambGain = ctx.createGain(); ambGain.gain.value = 0;
    amb.connect(ambFilter); ambFilter.connect(ambGain); ambGain.connect(master); amb.start();
    applyAmbience();
  }

  function applyAmbience() {
    if (!ctx) return;
    var a = ZONES[zone].amb, now = ctx.currentTime;
    ambFilter.type = a.type; ambFilter.Q.value = a.q;
    ambFilter.frequency.setTargetAtTime(a.f, now, 0.8);
    ambGain.gain.setTargetAtTime(a.g, now, 1.2);
  }

  function note(freq, t, dur, type, vol, bus) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus || music); o.start(t); o.stop(t + dur + 0.1);
  }
  function pad(freqs, t, dur, type) {
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 760; lp.connect(music);
    freqs.forEach(function (f) {
      [-4, 4].forEach(function (det) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = f; o.detune.value = det;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.028, t + dur * 0.45); g.gain.linearRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(lp); o.start(t); o.stop(t + dur + 0.1);
      });
    });
  }

  function tick() {
    if (!on || !ctx) return;
    var z = ZONES[zone], sec = 60 / z.bpm * 2, t = ctx.currentTime + 0.08;
    if (beat % 4 === 0) {                                  // a chord every 4 beats, slowly cycling
      var ch = z.chords[(beat / 4) % z.chords.length];
      pad(ch.map(function (s) { return tone(z.root, s); }), t, sec * 4.2, z.pad);
      note(tone(z.root / 2, ch[0]), t, sec * 3, 'sine', 0.07);
    }
    if (Math.random() > 0.28) {                            // melody: random walk on the scale, with rests
      idx = Math.max(0, Math.min(z.scale.length - 1, idx + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
      note(tone(z.root * 2, z.scale[idx]), t + Math.random() * sec * 0.3, sec * 1.6, z.wave, 0.05);
      if (Math.random() > 0.8) note(tone(z.root * 4, z.scale[idx]), t + sec * 0.5, sec, 'sine', 0.02);
    }
    beat++;
    timer = setTimeout(tick, sec * 1000);
  }

  function sfx(kind) {
    if (!on || !ctx) return;
    var t = ctx.currentTime + 0.01;
    if (kind === 'tick') note(760, t, 0.07, 'sine', 0.05, sfxBus);
    else if (kind === 'good') { note(659.25, t, 0.28, 'triangle', 0.13, sfxBus); note(880, t + 0.09, 0.36, 'triangle', 0.13, sfxBus); }
    else if (kind === 'bad') { note(233, t, 0.3, 'triangle', 0.11, sfxBus); note(196, t + 0.12, 0.42, 'triangle', 0.11, sfxBus); }
    else if (kind === 'medal') [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, t + i * 0.11, 0.7, 'triangle', 0.12, sfxBus); });
  }

  function setOn(v) {
    on = !!v;
    if (on) {
      if (!AC) { on = false; return; }
      if (!ctx) build();
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.6);
      applyAmbience();
      clearTimeout(timer); beat = 0; tick();
    } else if (ctx) {
      clearTimeout(timer);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      setTimeout(function () { if (!on && ctx) ctx.suspend(); }, 900);
    }
    paint();
  }

  /* ---------- button in the header ---------- */
  var btn;
  var ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  function paint() {
    if (!btn) return;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.innerHTML = on ? ICON_ON : ICON_OFF;
    btn.setAttribute('aria-label', App.t('soundLabel') + ': ' + App.t(on ? 'soundOn' : 'soundOff'));
    btn.title = App.t(on ? 'soundOn' : 'soundOff');
  }

  function setZone(z) {
    z = ZONES[z] ? z : 'home';
    if (z === zone) return;
    zone = z; idx = 2; applyAmbience();
  }

  function init() {
    btn = document.getElementById('soundBtn'); if (!btn) return;
    if (!AC) { btn.hidden = true; return; }
    btn.addEventListener('click', function () { setOn(!on); if (on) sfx('tick'); });
    paint(); App.onLang(paint);
    // zone follows the screen: body[data-zone] is set by the level engine and removed elsewhere
    var read = function () { setZone(document.body.getAttribute('data-zone') || 'home'); };
    new MutationObserver(read).observe(document.body, { attributes: true, attributeFilter: ['data-zone'] }); read();
    // soft click sound on every enabled button (only audible when sound is on)
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button'); if (b && !b.disabled && b !== btn) sfx('tick');
    }, true);
    document.addEventListener('visibilitychange', function () {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else if (on) ctx.resume();
    });
  }

  window.Sound = { init: init, sfx: sfx, zone: setZone, isOn: function () { return on; } };
})();
