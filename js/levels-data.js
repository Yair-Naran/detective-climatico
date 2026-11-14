/* Level definitions. Same mold for Costa / Centro / Norte: change city, places, options and string keys.
   All text lives in i18n/strings.js under the keys referenced here (prefix = level id). */
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
        items: [
          { id: 'water', ok: true }, { id: 'food', ok: true }, { id: 'docs', ok: true }, { id: 'aid', ok: true },
          { id: 'light', ok: true }, { id: 'radio', ok: true }, { id: 'whistle', ok: true }, { id: 'contacts', ok: true },
          { id: 'console', ok: false }, { id: 'dryer', ok: false }, { id: 'speaker', ok: false }
        ] },
      { id: 'radio', icon: '📻', cost: 1, type: 'clue', points: 5 },
      { id: 'paper', icon: '📰', cost: 1, type: 'data', variable: 't2m', season: 'annual', points: 5 },
      { id: 'rain', icon: '📚', cost: 1, type: 'data', variable: 'prectotcorr', season: 'annual', points: 5 },
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
    medals: { gold: 90, silver: 70, bronze: 45 },
    nextLevel: 'centro',
    alert: 'alert', // SIAT-CT labels
    outroIcons: { out1: '🌀', out2: '🌊', ref_ok: '🏫', ref_bad: '🚐', pack_ok: '🔦', pack_bad: '🎒', help: '🤝', end: '🌤️' }
  },

  /* Centro: Pachuca, extreme heat. Time = one hot day (the heat level rises as hours pass). */
  centro: {
    id: 'centro',
    city: 'pachuca',
    hours: 9,
    scoring: { backpack: 30, refuge: 20, info: 20, help: 15, share: 15 },
    intro: [
      { icon: '🌄', key: 'centro_in1', scene: 'calm' },
      { icon: '☀️', key: 'centro_in2', scene: 'alert' },
      { icon: '⏱️', key: 'centro_in3', scene: 'alert' }
    ],
    places: [
      { id: 'home', icon: '🧢', cost: 2, type: 'backpack', slots: 5,
        items: [
          { id: 'water', ok: true }, { id: 'cap', ok: true }, { id: 'sunscreen', ok: true }, { id: 'lightclothes', ok: true },
          { id: 'umbrella', ok: true }, { id: 'oralserum', ok: true },
          { id: 'boots', ok: false }, { id: 'console', ok: false }, { id: 'speaker', ok: false }
        ] },
      { id: 'radio', icon: '📻', cost: 1, type: 'clue', points: 5 },
      { id: 'paper', icon: '📰', cost: 1, type: 'data', variable: 't2m', season: 'MAM', points: 5 },
      { id: 'rain', icon: '🌱', cost: 1, type: 'data', variable: 'prectotcorr', season: 'JJA', points: 5 },
      { id: 'phone', icon: '📱', cost: 1, type: 'clue', points: 5 },
      { id: 'neighbor', icon: '🏡', type: 'choice', cat: 'help',
        options: [{ id: 'help', cost: 2, pts: 15 }, { id: 'water', cost: 1, pts: 6 }, { id: 'ignore', cost: 0, pts: 0 }] },
      { id: 'refuge', icon: '📚', cost: 1, type: 'choice', cat: 'refuge',
        options: [{ id: 'car', pts: 0 }, { id: 'library', pts: 20, good: true }, { id: 'field', pts: 0 }] },
      { id: 'chat', icon: '⚽', cost: 1, type: 'choice', cat: 'share',
        options: [{ id: 'move', pts: 15, good: true }, { id: 'soda', pts: 0 }, { id: 'play', pts: 0 }] }
    ],
    refugeFallback: 5,
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
    hours: 9,
    scoring: { backpack: 30, refuge: 20, info: 20, help: 15, share: 15 },
    intro: [
      { icon: '🏜️', key: 'norte_in1', scene: 'alert' },
      { icon: '🚰', key: 'norte_in2', scene: 'alert' },
      { icon: '⏱️', key: 'norte_in3', scene: 'calm' }
    ],
    places: [
      { id: 'home', icon: '🪣', cost: 2, type: 'backpack', slots: 4,
        items: [
          { id: 'drinkwater', ok: true }, { id: 'lidded', ok: true }, { id: 'gel', ok: true }, { id: 'reuse', ok: true },
          { id: 'oralserum', ok: true },
          { id: 'pool', ok: false }, { id: 'hose', ok: false }, { id: 'console', ok: false }
        ] },
      { id: 'radio', icon: '📻', cost: 1, type: 'clue', points: 5 },
      { id: 'paper', icon: '📰', cost: 1, type: 'data', variable: 't2m', season: 'JJA', points: 5 },
      { id: 'rain', icon: '🏞️', cost: 1, type: 'data', variable: 'prectotcorr', season: 'annual', points: 5 },
      { id: 'cold', icon: '🐄', cost: 1, type: 'data', variable: 't2m', season: 'DJF', points: 5 },
      { id: 'neighbor', icon: '🌵', type: 'choice', cat: 'help',
        options: [{ id: 'carry', cost: 2, pts: 15 }, { id: 'organize', cost: 1, pts: 12 }, { id: 'ignore', cost: 0, pts: 0 }] },
      { id: 'refuge', icon: '🌳', cost: 1, type: 'choice', cat: 'refuge',
        options: [{ id: 'pool', pts: 0 }, { id: 'hose', pts: 0 }, { id: 'shade', pts: 20, good: true }] },
      { id: 'chat', icon: '💬', cost: 1, type: 'choice', cat: 'share',
        options: [{ id: 'rumor', pts: 0 }, { id: 'calm', pts: 0 }, { id: 'official', pts: 15, good: true }] }
    ],
    refugeFallback: 5,
    medals: { gold: 90, silver: 70, bronze: 45 },
    nextLevel: null,
    alert: 'water',
    outroScenes: ['alert', 'alert', 'calm', 'calm', 'calm'],
    outroIcons: { out1: '🏞️', out2: '🚚', ref_ok: '🌳', ref_bad: '💦', pack_ok: '🪣', pack_bad: '🚱', help: '🤝', end: '❄️' }
  }
};
