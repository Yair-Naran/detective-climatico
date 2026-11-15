/* Level definitions. Same mold for Costa / Centro / Norte: change city, places, options and string keys.
   All text lives in i18n/strings.js under the keys referenced here (prefix = level id).
   Difficulty rises by case: Costa 9 h, wrong data answer still worth 1 point, no second question;
   Centro and Norte 8 h, wrong data answer worth 0, second question on every data clue, fewer backpack slots.
   Every case has one surprise event (appears after 3 hours are spent). */
window.ENDINGS = ['legend', 'gossip', 'lucky', 'tourist', 'scientist', 'hero', 'rookie'];
window.LEVELS = {
  costa: {
    id: 'costa',
    city: 'veracruz',
    hours: 9,
    // max points per category (sum = 100)
    scoring: { backpack: 30, refuge: 20, info: 20, help: 15, share: 15 },
    intro: [
      { icon: '🌊', key: 'costa_in1', scene: 'calm' },
      { icon: '🌀', key: 'costa_in2', scene: 'storm' },
      { icon: '⏱️', key: 'costa_in3', scene: 'alert' }
    ],
    places: [
      { id: 'home', icon: '🎒', cost: 2, type: 'backpack', slots: 6,
        // v = priority: 3 vital, 2 useful, 1 a little useful, 0 useless, -1 risky (order on screen is shuffled on purpose)
        items: [
          { id: 'garrafon', v: 0 }, { id: 'docs', v: 3 }, { id: 'console', v: 0 }, { id: 'whistle', v: 2 }, { id: 'water', v: 3 },
          { id: 'candles', v: -1 }, { id: 'radio', v: 3 }, { id: 'cash', v: 2 }, { id: 'speaker', v: 0 }, { id: 'aid', v: 3 },
          { id: 'powerbank', v: 2 }, { id: 'food', v: 3 }, { id: 'contacts', v: 2 }, { id: 'light', v: 3 }
        ] },
      { id: 'radio', icon: '📻', cost: 1, type: 'clue', points: 5 },
      { id: 'paper', icon: '📰', cost: 1, type: 'data', variable: 't2m', season: 'annual', points: 5, chart: 'line' },
      { id: 'rain', icon: '📚', cost: 1, type: 'data', variable: 'prectotcorr', season: 'annual', points: 5, chart: 'anom' },
      { id: 'phone', icon: '📱', cost: 1, type: 'clue', points: 5 },
      { id: 'neighbor', icon: '🏡', type: 'choice', cat: 'help',
        options: [{ id: 'walk', cost: 2, pts: 15 }, { id: 'call', cost: 1, pts: 12 }, { id: 'stay', cost: 0, pts: 0 }] },
      { id: 'refuge', icon: '🏫', cost: 1, type: 'choice', cat: 'refuge',
        options: [{ id: 'school', pts: 20, good: true }, { id: 'river', pts: 0 }, { id: 'beach', pts: 0 }] },
      { id: 'chat', icon: '💬', cost: 1, type: 'choice', cat: 'share',
        options: [{ id: 'rumor', pts: 0 }, { id: 'official', pts: 15, good: true }, { id: 'calm', pts: 0 }] }
    ],
    // points if the player never chose a refuge (evacuated by Protección Civil)
    refugeFallback: 5,
    dataWrongPts: 1,           // Costa is the entry case: a wrong data answer still earns a little
    quiz: false,               // no second data question here
    event: { icon: '📲', options: [{ id: 'check', cost: 0, good: true }, { id: 'go', cost: 1 }] },
    medals: { gold: 90, silver: 70, bronze: 45 },
    nextLevel: 'centro',
    alert: 'alert', // SIAT-CT labels
    outroIcons: { out1: '🌀', out2: '🌊', ref_ok: '🏫', ref_bad: '🚐', pack_ok: '🔦', pack_bad: '🎒', help: '🤝', end: '🌤️' }
  },

  /* Centro: Pachuca, extreme heat. Time = one hot day (the heat level rises as hours pass). */
  centro: {
    id: 'centro',
    city: 'pachuca',
    hours: 8,                  // harder: one hour less than Costa
    scoring: { backpack: 30, refuge: 20, info: 20, help: 15, share: 15 },
    intro: [
      { icon: '🌄', key: 'centro_in1', scene: 'calm' },
      { icon: '☀️', key: 'centro_in2', scene: 'alert' },
      { icon: '⏱️', key: 'centro_in3', scene: 'alert' }
    ],
    places: [
      { id: 'home', icon: '🧢', cost: 2, type: 'backpack', slots: 5,
        items: [
          { id: 'soda', v: 0 }, { id: 'cap', v: 3 }, { id: 'jacket', v: 0 }, { id: 'oralserum', v: 2 }, { id: 'console', v: 0 },
          { id: 'water', v: 3 }, { id: 'darkshirt', v: 0 }, { id: 'sunscreen', v: 2 }, { id: 'fan', v: 1 }, { id: 'lightclothes', v: 3 },
          { id: 'boots', v: 0 }, { id: 'umbrella', v: 2 }
        ] },
      { id: 'radio', icon: '📻', cost: 1, type: 'clue', points: 5 },
      { id: 'paper', icon: '📰', cost: 1, type: 'data', variable: 't2m', season: 'MAM', points: 5, chart: 'stripes' },
      { id: 'rain', icon: '🌱', cost: 1, type: 'data', variable: 'prectotcorr', season: 'JJA', points: 5, chart: 'anom' },
      { id: 'phone', icon: '📱', cost: 1, type: 'clue', points: 5 },
      { id: 'neighbor', icon: '🏡', type: 'choice', cat: 'help',
        options: [{ id: 'help', cost: 2, pts: 15 }, { id: 'water', cost: 1, pts: 6 }, { id: 'ignore', cost: 0, pts: 0 }] },
      { id: 'refuge', icon: '📚', cost: 1, type: 'choice', cat: 'refuge',
        options: [{ id: 'car', pts: 0 }, { id: 'library', pts: 20, good: true }, { id: 'field', pts: 0 }] },
      { id: 'chat', icon: '⚽', cost: 1, type: 'choice', cat: 'share',
        options: [{ id: 'move', pts: 15, good: true }, { id: 'soda', pts: 0 }, { id: 'play', pts: 0 }] }
    ],
    refugeFallback: 5,
    dataWrongPts: 0,
    quiz: true,                // second question on each data clue (projection / what p > 0.05 means)
    event: { icon: '🔌', options: [{ id: 'cool', cost: 0, good: true }, { id: 'search', cost: 1 }] },
    medals: { gold: 90, silver: 70, bronze: 45 },
    nextLevel: 'norte',
    alert: 'heat', // heat level labels
    outroScenes: ['alert', 'alert', 'calm', 'calm', 'calm'],
    outroIcons: { out1: '☀️', out2: '🚑', ref_ok: '📚', ref_bad: '🥵', pack_ok: '🧢', pack_bad: '💧', help: '🤝', end: '🌙' }
  },

  /* Norte: Monterrey, drought (water cuts) + a look at winter cold. NPC names from i18n/dialogos_npcs.json. */
  norte: {
    id: 'norte',
    city: 'monterrey',
    hours: 8,
    scoring: { backpack: 30, refuge: 20, info: 20, help: 15, share: 15 },
    intro: [
      { icon: '🏜️', key: 'norte_in1', scene: 'alert' },
      { icon: '🚰', key: 'norte_in2', scene: 'alert' },
      { icon: '⏱️', key: 'norte_in3', scene: 'calm' }
    ],
    places: [
      { id: 'home', icon: '🪣', cost: 2, type: 'backpack', slots: 4,
        items: [
          { id: 'pool', v: 0 }, { id: 'lidded', v: 3 }, { id: 'wipes', v: 1 }, { id: 'opentank', v: -1 }, { id: 'drinkwater', v: 3 },
          { id: 'console', v: 0 }, { id: 'reuse', v: 2 }, { id: 'hose', v: 0 }, { id: 'gel', v: 2 }, { id: 'oralserum', v: 2 }
        ] },
      { id: 'radio', icon: '📻', cost: 1, type: 'clue', points: 5 },
      { id: 'paper', icon: '📰', cost: 1, type: 'data', variable: 't2m', season: 'JJA', points: 5, chart: 'decades' },
      { id: 'rain', icon: '🏞️', cost: 1, type: 'data', variable: 'prectotcorr', season: 'annual', points: 5, chart: 'line' },
      { id: 'cold', icon: '🐄', cost: 1, type: 'data', variable: 't2m', season: 'DJF', points: 5, chart: 'stripes' },
      { id: 'neighbor', icon: '🌵', type: 'choice', cat: 'help',
        options: [{ id: 'carry', cost: 2, pts: 15 }, { id: 'organize', cost: 1, pts: 12 }, { id: 'ignore', cost: 0, pts: 0 }] },
      { id: 'refuge', icon: '🌳', cost: 1, type: 'choice', cat: 'refuge',
        options: [{ id: 'pool', pts: 0 }, { id: 'hose', pts: 0 }, { id: 'shade', pts: 20, good: true }] },
      { id: 'chat', icon: '💬', cost: 1, type: 'choice', cat: 'share',
        options: [{ id: 'rumor', pts: 0 }, { id: 'calm', pts: 0 }, { id: 'official', pts: 15, good: true }] }
    ],
    refugeFallback: 5,
    dataWrongPts: 0,
    quiz: true,
    event: { icon: '🚿', options: [{ id: 'remind', cost: 0, good: true }, { id: 'film', cost: 1 }] },
    medals: { gold: 90, silver: 70, bronze: 45 },
    nextLevel: null,
    alert: 'water',
    outroScenes: ['alert', 'alert', 'calm', 'calm', 'calm'],
    outroIcons: { out1: '🏞️', out2: '🚚', ref_ok: '🌳', ref_bad: '💦', pack_ok: '🪣', pack_bad: '🚱', help: '🤝', end: '❄️' }
  }
};
