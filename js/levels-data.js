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
    nextLevel: 'centro'
  }
};
