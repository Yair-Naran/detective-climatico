# Submission texts (English) — NASA Space Apps 2026

Fill in the [BRACKETS] before sending. Everything below is in English because the form and linked materials must be in English.
Do not put the minor teammate's name, image or voice in the demo or project page unless the Local Lead confirms it is allowed.

## Project Name
Climate Detective

## High-Level Summary
Climate Detective is a mobile-friendly game and data tool for teenagers in Mexico. Players investigate real NASA POWER temperature and rainfall records with the "Detective's Archive" (pick a place, variable and period, see the time series and a trend with a significance test) and then use what they find to prepare their community for a cyclone, a heat wave or a drought.

## Link to Project Demo
[VIDEO OR SLIDES LINK — max 30 s video with English subtitles, or max 7 slides]

## Link to Final Project
https://yair-naran.github.io/detective-climatico/?lang=en

## Detailed Project Description
**The problem.** "Is the climate really changing where I live?" is hard to answer from headlines. Teenagers hear claims about heat, rain and storms, but rarely check them against data, and many do not know that a trend must be tested before we call it real.

**What we built.** A free web game (no sign-up, no backend) with two parts:
1. **Detective's Archive (the challenge tool).** The player chooses a variable (air temperature at 2 m or precipitation), a region (Veracruz on the Gulf coast, Pachuca in the central highlands at 2,338 m, Monterrey in the semi-arid north), a time of year (whole year or a season) and a period. The tool draws the time series, fits a linear trend (Sen's slope) and tests it with the Mann-Kendall test. It reports the rate of change per decade and the p-value, and explains in plain words what "significant" means, including that p > 0.05 does not prove that nothing is changing. Seasonal averages remove the seasonal cycle, and only complete seasons are used.
2. **Three playable cases.** Coast (Veracruz: cyclones and heavy rain), Center (Pachuca: extreme heat) and North (Monterrey: drought, water cuts and winter cold). In each case the player has nine hours to visit places in the community, check a rumor or headline against NASA data, pack an emergency backpack, help a neighbor, choose a safe refuge and share reliable information. Time is limited, so every choice has a cost. The score is a preparedness percentage with a medal, and a good result carries a bonus into the next case. The player can share a result card as an image.
3. **Difficulty and replay value.** Difficulty rises by case: Center and North give one hour less, include a bonus question on every data clue (what a trend means in 30 years, or what p > 0.05 really means) and give no points for a wrong reading. Each case has a surprise event with light humor (a viral voice message, a power cut, a neighbor washing his truck during rationing). The emergency backpack has more items than slots, including tempting traps, and scores items by priority (vital, useful, helps a little, useless, risky). Seven different endings per case depend on the player's choices, with a counter of endings found.
4. **More ways to see the data.** The Archive offers five chart types: series with trend line, anomaly bars against 1991–2020, climate stripes, decade averages and the month-by-month cycle (first vs. last 10 years). Every chart has a tap-to-read tooltip and a plain-language note on how to read it.
5. **Glossary.** A searchable glossary explains every technical term used in the game (T2M, reanalysis, Mann-Kendall, p-value, anomaly, SIAT-CT, drought categories, and more), reachable from the home screen, the Archive and every case.

**What makes it different.** The data tool is the core mechanic, not a quiz added on top: players must read the chart and the p-value to decide whether a claim is true. Some claims are true (Pachuca is warming about +0.4 °C per decade; Pachuca summer rain is decreasing) and some are not supported (annual rainfall trends in Veracruz and Monterrey are not significant). The game teaches both.

**Scientific care.** We do not claim that a single flood, cyclone or drought is proven by annual averages; extreme events are presented as context from IPCC AR6, and warnings in the game come from official forecasts (the Mexican cyclone alert system SIAT-CT), not from trends. We state the limits: data come from a grid cell about 50 km wide, not from a weather station, and MERRA-2 is a reanalysis. The Mann-Kendall implementation was checked against the scipy library and against three test cases with known answers.

**Impact.** The game gives teenagers a repeatable way to test climate claims with real data and links that understanding to concrete preparedness actions based on Mexican Civil Protection guidance. It is bilingual (Spanish/English), works on phones, needs no account and stores progress only on the device.

**Technology.** HTML, CSS and JavaScript with no framework; statistics computed in the browser; data stored as a small JSON file generated by a Python script from the NASA POWER API; hosted on GitHub Pages. All illustrations are original vector art drawn in code. Source code: https://github.com/Yair-Naran/detective-climatico (MIT license).

## Use of SI (Artificial Intelligence)
- Code and text of the game were written with help from Claude (Anthropic), which also helped plan the project and draft these submission texts. The team reviewed and tested the results.
- The statistics code was validated against scipy and hand-calculated cases.
- No AI image generators were used. The illustrations are vector art written as code. [If the team later uses AI-generated images: list them here, with a visible watermark on each image.]
- NPC dialogue was drafted by the team and edited with AI assistance for tone.

## NASA Data
- NASA POWER (Prediction Of Worldwide Energy Resources), monthly data: T2M (air temperature at 2 m) and PRECTOTCORR (bias-corrected precipitation), 1981 to 2026, for three Mexican locations (Veracruz 19.18, -96.14; Pachuca 20.12, -98.73; Monterrey 25.67, -100.31). https://power.larc.nasa.gov
- Underlying products: MERRA-2 (NASA GMAO) reanalysis and GPM IMERG precipitation.

## Space Agency Partner Data and Other References
- IPCC, AR6 Working Group I (2021), chapter 11, on weather and climate extremes.
- SIAT-CT, National Civil Protection System of Mexico (tropical cyclone alert system).
- Civil Protection and CENAPRED: emergency backpack guidance (72 hours).
- National Weather Service of Mexico (Conagua/SMN): heat wave definition.
- Mexico Drought Monitor (Conagua-SMN): drought categories D0 to D4.
- Ministry of Health of Mexico: heatstroke prevention and first aid; safe water storage.
- Mann, H.B. (1945) and Kendall, M.G. (1975): trend test. Sen, P.K. (1968): slope estimator.
- World Meteorological Organization: 1991–2020 climatological standard normal (reference period for anomalies).
- Ed Hawkins (2018): the "warming stripes" visualization idea (redrawn by the team in code).
- Code: scipy (used only to validate the tests, not shipped with the game). No third-party libraries or images are shipped with the game.
- Fonts: Archivo (Omnibus-Type) and Atkinson Hyperlegible Next (Braille Institute), SIL Open Font License 1.1, self-hosted in `fonts/` with their licenses. Icons: line icons drawn in code by the team (`js/icons.js`).

## Demo plan (30-second video or 7 slides)
Must show: team name, member names (adults only or as the Local Lead allows), challenge name, the project, the user experience, and how NASA data make it possible. No NASA logos, no images or voices of minors, English subtitles.

Video (30 s): 0–4 s title card and challenge; 4–12 s Archive: choose Pachuca, temperature, see trend and p-value; 12–22 s game hub and a choice with time cost; 22–27 s result card and medal; 27–30 s "NASA POWER data" and link.

Slides (7): 1 Title/team/challenge · 2 The question · 3 Archive screenshot · 4 Game hub screenshot · 5 How NASA data are used (source, method, limits) · 6 What players learn · 7 Link and credits.
