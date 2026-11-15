# Submission texts (English): NASA Space Apps 2026

Everything below is in English because the form and linked materials must be in English.
Only one placeholder is left: the demo link (the demo is produced last). The team names are final.

## Team
Burros Espaciales: Rafael Alfredo Pérez Acosta, Evelyn Amairani Torres Valdez, Yair Alejandro Naranjo Rodríguez (Pachuca, Hidalgo, Mexico).

## Project Name
The Climate Case Files

## High-Level Summary
The Climate Case Files is a mobile-friendly game and data tool for teenagers. Players investigate real NASA POWER temperature, rainfall and humidity records with the "Detective's Archive": pick any place on Earth, a variable, a season and a period; see the time series and a trend with a significance test; then use what they find to prepare a community for a cyclone, a heat wave or a drought in Mexico.

## Link to Project Demo
[DEMO LINK: max 30 s video with English subtitles, or max 7 slides, public link]

## Link to Final Project
https://yair-naran.github.io/detective-climatico/?lang=en

## Detailed Project Description
**The problem.** "Is the climate really changing where I live?" is hard to answer from headlines. Teenagers hear claims about heat, rain and storms but rarely check them against data, and many do not know that a trend must be tested before we call it real.

**What we built.** A free web game (no sign-up, no backend, no tracking, works offline after the first visit) with two parts:
1. **Detective's Archive (the challenge tool, covers all five steps of the challenge).** (1) Choose a variable: air temperature, daily maximum, daily minimum, rainfall or relative humidity. (2) Choose a region: three built-in places (Veracruz on the Gulf coast, Pachuca in the central highlands at 2,338 m, Monterrey in the semi-arid north), a list of quick picks, or **any latitude and longitude on Earth**, loaded live from the NASA POWER API. (3) Choose the time of year (whole year or a season) and the period. (4) The tool draws the time series in five chart types (series with trend line, anomaly bars against the 1991-2020 normal, climate stripes, decade averages, and the month-by-month cycle for the first versus the last 10 years), each with a tap-to-read tooltip and a plain-language note on how to read it. (5) It fits a linear trend (Sen's slope) and tests it with the Mann-Kendall test, reporting the change per decade and the p-value, and explains in plain words what "significant" means, including that p > 0.05 does not prove that nothing is changing. Seasonal averages remove the seasonal cycle and only complete seasons are used.
2. **Extra tools in the Archive.** *Compare places* shows the same analysis for every loaded place side by side. *Hunch mode* asks the player to guess what the test will say before the result is revealed and keeps a score, which trains the habit of testing a feeling against data. Data can be exported as CSV and any chart as a PNG for a school report.
3. **Three playable cases.** Coast (Veracruz: cyclones and heavy rain), Center (Pachuca: extreme heat) and North (Monterrey: drought, water cuts and winter cold). In each case the player has limited hours to visit places in the community, check a rumor or headline against NASA data, pack an emergency backpack, help a neighbor, choose a safe refuge and share reliable information. Time is limited, so every choice has a cost. The score is a preparedness percentage with a medal, and a good result carries a bonus into the next case. Difficulty rises by case (Center and North give one hour less, add a bonus question on every data clue and give no points for a wrong reading). Each case has a surprise event with light humor, an emergency backpack with more items than slots including tempting traps, and seven different endings with a counter of endings found. Players can share a result card as an image.
4. **Glossary and method.** A searchable glossary explains every technical term, and a Method, sources and credits screen states the data, the statistics, the limits, the use of AI and the team.
5. **Sound.** Original music and sound effects are synthesized live in the browser (Web Audio API) with a different mood for each zone. They start muted and have a sound button.

**What makes it different.** The data tool is the core mechanic, not a quiz added on top: players must read the chart and the p-value to decide whether a claim is true. Some claims are true (Pachuca is warming about +0.4 °C per decade; Pachuca summer rain is decreasing) and some are not supported (annual rainfall trends in Veracruz and Monterrey are not significant). The game teaches both. Unlike fixed climate viewers, players can investigate any place on Earth, guess before they see the answer, and compare places.

**Scientific care.** We do not claim that a single flood, cyclone or drought is proven by annual averages; extreme events are presented as context from IPCC AR6, and warnings in the game come from official forecasts (the Mexican cyclone alert system SIAT-CT), not from trends. We state the limits: data come from a grid cell about 50 km wide, not from a weather station; MERRA-2 is a reanalysis; its daily maximum temperature is slightly underestimated and its minimum slightly overestimated, so we show trends and warn against reading absolute values. The Mann-Kendall implementation is checked against scipy and pymannkendall for every built-in place, variable and season (automated tests in the repository).

**Quality.** Automated tests: statistics against scipy and pymannkendall; 18 end-to-end checks in a real browser including full playthroughs of the three cases, the Archive, live places, exports, offline mode and mobile layout; and an axe-core accessibility audit with no WCAG 2.1 A/AA violations on the main screens.

**Impact.** The game gives teenagers a repeatable way to test climate claims with real data and links that understanding to concrete preparedness actions based on Mexican Civil Protection guidance. It is bilingual (Spanish/English), works on phones, needs no account and stores progress only on the device.

**Technology.** HTML, CSS and JavaScript with no framework; statistics computed in the browser; built-in data stored as a small JSON file generated by a Python script from the NASA POWER API; other places requested live from the same API; hosted on GitHub Pages. The illustrations (characters, maps, cover, medals, some icons) are AI-generated by the team and labeled as such; the rest is vector art drawn in code. Source code: https://github.com/Yair-Naran/detective-climatico (MIT license).

## Use of SI (Artificial Intelligence)
- Code, automated tests and text of the game were written with help from Claude (Anthropic), which also helped plan the project and draft these submission texts. The team reviewed, edited and tested the results.
- The statistics code was validated against scipy and pymannkendall.
- Audio: the music and sound effects are not AI-generated audio and not recordings. They are produced by code we wrote (with Claude's help) that synthesizes sound with the Web Audio API.
- Illustrations: the characters, the case maps (normal and disaster versions), the cover, the medals and the icons for information sources and variables are AI-generated images made by the team with an AI image generator [TEAM: write here the exact tool or model name]. They are labeled as AI-generated in the game (footer and Method screen). The animations, header logo and other icons are code-drawn vector art.
- NPC dialogue was drafted by the team and edited with AI assistance for tone.

## NASA Data
- NASA POWER (Prediction Of Worldwide Energy Resources), monthly data: T2M (air temperature at 2 m), T2M_MAX, T2M_MIN, PRECTOTCORR (bias-corrected precipitation) and RH2M (relative humidity), 1981 to 2026. Built-in places: Veracruz (19.18, -96.14), Pachuca (20.12, -98.73), Monterrey (25.67, -100.31). Any other point is requested live. https://power.larc.nasa.gov
- Underlying products: MERRA-2 (NASA GMAO) reanalysis and GPM IMERG precipitation.

## Space Agency Partner Data and Other References
- IPCC, AR6 Working Group I (2021), chapter 11, on weather and climate extremes.
- SIAT-CT, National Civil Protection System of Mexico (tropical cyclone alert system).
- Civil Protection and CENAPRED: emergency backpack guidance (72 hours).
- National Weather Service of Mexico (Conagua/SMN): heat wave definition.
- Mexico Drought Monitor (Conagua-SMN): drought categories D0 to D4.
- Ministry of Health of Mexico: heatstroke prevention and first aid; safe water storage.
- Mann, H.B. (1945) and Kendall, M.G. (1975): trend test. Sen, P.K. (1968): slope estimator.
- World Meteorological Organization: 1991-2020 climatological standard normal (reference period for anomalies).
- Ed Hawkins (2018): the "warming stripes" visualization idea (redrawn by the team in code).
- Code: no third-party libraries are shipped with the game. Development-only tools: scipy and pymannkendall (to validate the statistics), Playwright (playwright-core) and axe-core (tests), none of them included in the game.
- Fonts: Climate Crisis (Daniel Coull / Helsingin Sanomat) for the title, Anybody (Etcetera Type Co) for headlines, buttons and labels, and Atkinson Hyperlegible Next (Braille Institute) for reading; SIL Open Font License 1.1, self-hosted in `fonts/` with their licenses. Icons: line icons drawn in code by the team (`js/icons.js`). Music and sounds: generated by our code (`js/audio.js`), no samples.

## Demo plan (30-second video or 7 slides)
Must show: team name and member names, challenge name, the project, the user experience, and how NASA data make it possible. No NASA logos, no images or voices of minors, English subtitles.

Video (30 s): 0-4 s title card, team and challenge; 4-13 s Archive: choose a place (even one typed by coordinates), see the trend and p-value; 13-22 s game hub and a choice with time cost; 22-27 s result card and medal; 27-30 s "NASA POWER data" and link.

Slides (7): 1 Title, team, challenge · 2 The question · 3 Archive screenshot (any place, p-value) · 4 Game hub screenshot · 5 How NASA data are used (source, method, limits) · 6 What players learn and what makes it different · 7 Link and credits.
