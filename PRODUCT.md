# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Teenagers in Mexico aged 12–17 who hear claims about heat, rain and storms and want to know whether they are true where they live. The first audience that must be won over is the NASA Space Apps Challenge 2026 judging panel, who evaluate the game on a laptop: the first screen has to make the project's seriousness and appeal obvious at once.

## Product Purpose

Climate Detective is a free, bilingual (ES/EN) web game and data tool. Players read real NASA POWER temperature and rainfall series, test whether a trend is real (Sen's slope + Mann-Kendall, p-value), and use what they find to prepare a community for a cyclone (Veracruz), a heat wave (Pachuca) or a drought (Monterrey). Success: a teen can tell a supported climate claim from an unsupported one and connects that to concrete preparedness actions.

## Positioning

The data tool is the core mechanic, not a quiz on top: the player must read the chart and the p-value to decide whether a claim holds. Some claims are true (Pachuca warming ≈ +0.4 °C/decade) and some are not supported (annual rain in Veracruz and Monterrey); the game teaches both.

## Operating Context

- Played in a browser, phone or laptop; judges review it on a laptop.
- Flow: home → playable tutorial → case (intro cinematic → time-limited hub of places → data clues, backpack, choices, surprise event → outro → results with medal and one of seven endings).
- Detective's Archive: city / variable / season / period selectors, five chart types with tooltips, verdict panel.
- Searchable glossary and a Method, sources and credits screen.

## Capabilities and Constraints

- Plain HTML, CSS and JavaScript, no framework, no build step, no backend; hosted on GitHub Pages.
- No third-party libraries or images shipped; illustrations are original vector art drawn in code.
- Progress stored only on the device (localStorage); no sign-up.
- All game text lives in `i18n/strings.js` (ES/EN); texts, data, cases and game logic are not to be changed by visual work.

## Brand Commitments

- Name: "Detective climático" / "Climate Detective".
- Not an official NASA product: no NASA logos; footer disclaimer stays.
- Emojis may be replaced by drawn SVG icons; logo, hero illustration and animated landscapes may be redrawn.
- Tone confirmed by the team: must not feel childish (primary-school), corporate/governmental, or hard to read.
- Tone update confirmed by the user (Nov 2026): less formal. A youthful game with attitude for 12–17-year-olds: playful energy, humour in motion and type, premium finish; still not primary-school, and the science (charts, p-value, verdicts) stays clear and serious.
- The climate-stripes identity (real NASA POWER data) stays the core of the brand; type, buttons and motion may change.

## Evidence on Hand

- `data/series.json`: NASA POWER monthly T2M and PRECTOTCORR for Veracruz, Pachuca, Monterrey (1981–2026).
- `docs/ENTREGA-EN.md`: submission text; `ASSETS.md`: source register.
- No testimonials, user counts or awards exist; none may be invented.

## Product Principles

1. The data is the game: every visual decision should make reading a chart feel like detective work, not decoration around it.
2. Honest science: state limits, never overclaim what a trend proves.
3. Respect the player: serious enough for a teenager to feel taken seriously, lively enough to want to keep playing.
4. Works anywhere: phone-first, no account, no network beyond the page itself.

## Accessibility & Inclusion

- Readable contrast and sizes are a confirmed requirement ("must not be hard to read").
- Keep keyboard focus states, 44px+ touch targets, `prefers-reduced-motion` support and ES/EN parity.
