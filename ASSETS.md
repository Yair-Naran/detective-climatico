# Asset register (feeds the "References" and "Use of SI" fields)

Everything used in the project (code, text, images, audio, libraries), including free and open-source material.

## Data
| Resource | Source | Terms | URL |
|---|---|---|---|
| Monthly T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, RH2M | NASA POWER (MERRA-2; precipitation bias-corrected with GPM IMERG) | NASA open data | https://power.larc.nasa.gov |

The three built-in places are stored in `data/series.json` (T2M and PRECTOTCORR). Any other place and the extra variables are requested live from the POWER API by `js/power.js` and cached in the browser for 30 days.

## Code
| Resource | Author | License | Note |
|---|---|---|---|
| `js/*.js`, `index.html`, `css/`, `sw.js`, `tests/` | Team, written with help from Claude (AI) | MIT | Declare AI use in "Use of SI". Mann-Kendall validated against scipy and pymannkendall. |
| No third-party code is shipped | | | Dev-only: `playwright-core` (Apache-2.0) and `axe-core` (MPL-2.0) for tests; scipy and pymannkendall for validation. |

## Preparedness content (our own text, based on)
| Source | Use |
|---|---|
| SIAT-CT, National Civil Protection System (2019 manual, gob.mx) | 5-color alerts in the Coast case |
| Civil Protection / CENAPRED, emergency backpack | Backpack items (72 h) and priorities (vital / useful), candle risk |
| IPCC AR6 WGI (2021), ch. 11 | Rain in cyclones, share of intense cyclones, storm surge, more frequent heat extremes since 1950 |
| National Weather Service (Conagua) / CENAPRED | Heat wave definition (Center case) |
| Mexico Drought Monitor (Conagua - SMN) | Drought categories D0-D4 (North case) |
| Ministry of Health | Clean covered water containers; avoid sun 11:00-16:00, heatstroke signs and first aid, call 911 |
| Civil Protection Nuevo León | No charcoal stoves or braziers indoors (North case) |
| World Meteorological Organization | 1991-2020 reference period for anomalies and stripes |
| Ed Hawkins (2018), "warming stripes" | Stripes chart idea (drawn by the team in code) |

## Team content
| Resource | Author | Note |
|---|---|---|
| `i18n/strings.js` | Team + Claude | All texts, Spanish and English |
| `i18n/dialogos_npcs.json` | Team | NPC dialogue (ES/EN), edited with AI assistance for tone |
| `scripts/fetch_power.py`, `scripts/fetch_nasa_power.py` | Team | Download from NASA POWER |

## Art, audio and fonts
Animated landscapes, the header logo and most line icons: original, drawn in code as SVG and CSS (`js/art.js`, `js/icons.js`, `css/style.css`). Icons: drawn in code (`js/icons.js`). The climate stripes on the home screen are computed from the NASA POWER data (`js/stripes.js`).

**Music and sound effects:** generated live in the browser by `js/audio.js` (Web Audio API oscillators, filters and noise). Original composition by algorithm: no samples, recordings or third-party music, so there is no copyright to clear. Not AI-generated audio.

| Resource | Source | License | URL | File in repo |
|---|---|---|---|---|
| Climate Crisis (title font) | Daniel Coull / Helsingin Sanomat | SIL OFL 1.1 | https://github.com/fontsource/font-files (Fontsource 5.3.0) | `fonts/ClimateCrisis-YEAR.woff2`, `fonts/OFL-ClimateCrisis.txt` |
| Anybody (headlines, buttons) | Etcetera Type Co | SIL OFL 1.1 | Fontsource 5.3.0 | `fonts/Anybody-*.woff2`, `fonts/OFL-Anybody.txt` |
| Atkinson Hyperlegible Next (reading) | Braille Institute | SIL OFL 1.1 | Google Fonts | `fonts/AtkinsonHyperlegibleNext-*.woff2`, `fonts/OFL-AtkinsonHyperlegibleNext.txt` |

App icons (`icons/icon-192.png`, `icons/icon-512.png`) are rendered from the team's own logo SVG. The social-share image (`icons/og.png`) uses the Pachuca annual temperature from `data/series.json` as colored stripes plus the project fonts; made with a script, no third-party artwork.

### Team illustrations (`assets/`, AI-generated; no real people, no minors, no NASA marks)
| Folder | Content |
|---|---|
| `assets/chars/` | Adult characters: Capitán Ríos, Don Tacho, Doña Meche, Doctora (unused so far), Prof. Aréchiga, Don Rómulo, Arq. Elena, Enfermera Lupita, Chela (unused), Abuela Chayo, Don Homero, Ing. Sofía Garza, two extras (unused) and the mascot astronaut donkey |
| `assets/maps/` | Case maps: Veracruz (coast, storm, pier, plaza), Pachuca (center, heat), Monterrey (view, street, snow) |
| `assets/icons/` | Medals (gold, silver, bronze) and icons: radio, newspaper, chat, health center, temperature (mean, max, min), rain, humidity |
| `assets/cover/` | Cover image (also the social-share image `icons/og.jpg`) |

## Use of AI (Use of SI)
- Code, tests and texts written with Claude (Anthropic); reviewed and tested by the team.
- Illustrations in `assets/` (characters, case maps, cover, medals, information and variable icons): AI-generated images made by the team with an AI image generator [TEAM: add tool/model name]. Optimized to WebP for the web with a script. Labeled as AI-generated in the game.
- Audio: synthesized by code (see above); not AI-generated audio.
- Header logo, animations and the other icons: SVG code written with Claude's help; not AI-generated images.
