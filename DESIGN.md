---
name: Climate Detective
description: "Franjas del clima: a graphite-ink game world where every colour is a climate scale and the warming stripes are the identity."
colors:
  graphite-ground: "#0e1116"
  graphite-deep: "#0a0c10"
  panel: "#171b22"
  panel-raised: "#1e232b"
  panel-high: "#262c36"
  line: "#2a303a"
  line-strong: "#3a424e"
  ink: "#f3f5f8"
  ink-soft: "#c9d0da"
  mute: "#a1aab7"
  action-red: "#c8432f"
  action-red-deep: "#b83a27"
  action-ink: "#ffffff"
  rdbu-cold-4: "#053061"
  rdbu-cold-3: "#2166ac"
  rdbu-cold-2: "#4393c3"
  rdbu-cold-1: "#92c5de"
  rdbu-cold-0: "#d1e5f0"
  rdbu-neutral: "#f7f7f7"
  rdbu-warm-0: "#fddbc7"
  rdbu-warm-1: "#f4a582"
  rdbu-warm-2: "#d6604d"
  rdbu-warm-3: "#b2182b"
  rdbu-warm-4: "#67001f"
  brbg-dry-2: "#8c510a"
  brbg-dry-1: "#bf812d"
  brbg-dry-0: "#dfc27d"
  brbg-wet-1: "#80cdc1"
  brbg-wet-2: "#35978f"
  alert-yellow: "#f2d16b"
  alert-orange: "#f4a261"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7.2vw, 5.4rem)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 4.4vw, 3rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 118"
  figure:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.6rem, 10vw, 5.6rem)"
    fontWeight: 900
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 118"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 2.4vw, 1.7rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 112"
  title-card:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.18rem"
    fontWeight: 800
    lineHeight: 1.2
    fontVariation: "\"wdth\" 108"
  title-small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 750
    lineHeight: 1.3
    fontVariation: "\"wdth\" 100"
  body:
    fontFamily: "\"Atkinson Hyperlegible Next\", \"Segoe UI\", system-ui, -apple-system, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "\"Atkinson Hyperlegible Next\", \"Segoe UI\", system-ui, -apple-system, Roboto, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 650
    letterSpacing: "0.005em"
    fontVariation: "\"wdth\" 100"
  button-hero:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 850
    letterSpacing: "0.06em"
    fontVariation: "\"wdth\" 115"
  label-caps:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 750
    letterSpacing: "0.06em"
    fontVariation: "\"wdth\" 75"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 650
    letterSpacing: "0.02em"
    fontVariation: "\"wdth\" 80"
  numeric:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    fontFeature: "\"tnum\" 1"
rounded:
  xs: "6px"
  sm: "10px"
  tile: "12px"
  md: "14px"
  full: "999px"
spacing:
  xxs: "4px"
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  xxl: "48px"
  gutter: "clamp(16px, 4vw, 40px)"
  card: "clamp(18px, 3vw, 30px)"
  max-width: "1040px"
components:
  button-primary:
    backgroundColor: "{colors.action-red}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.action-red-deep}"
    textColor: "{colors.action-ink}"
  button-hero:
    backgroundColor: "{colors.action-red}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button-hero}"
    rounded: "{rounded.sm}"
    padding: "16px 26px"
    height: "62px"
    width: "100%"
  button-secondary:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
    height: "50px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
  button-ghost-hover:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.card}"
  case-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0"
  place-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
    height: "132px"
  option:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 18px"
    height: "52px"
  option-hover:
    backgroundColor: "{colors.panel-high}"
  item:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    height: "56px"
  badge:
    textColor: "{colors.rdbu-cold-1}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  chip:
    backgroundColor: "{colors.panel-high}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "3px 10px"
  pill:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-small}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  segmented-on:
    backgroundColor: "{colors.rdbu-cold-3}"
    textColor: "{colors.action-ink}"
    rounded: "9px"
    padding: "6px 14px"
    height: "40px"
  select:
    backgroundColor: "{colors.graphite-deep}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 40px 10px 14px"
    height: "50px"
  stripe-readout:
    backgroundColor: "{colors.graphite-deep}"
    textColor: "{colors.ink}"
    typography: "{typography.numeric}"
    rounded: "{rounded.xs}"
    padding: "4px 9px 4px 22px"
  year-chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.graphite-ground}"
    typography: "{typography.numeric}"
    rounded: "{rounded.xs}"
    padding: "2px 10px"
---

# Design System: Climate Detective

## Overview

**Creative North Star: "Franjas del clima" (The Climate Stripes)**

The warming stripes are the identity, and they are made of real data: annual NASA POWER temperature anomalies for Veracruz, Pachuca and Monterrey, 1981 to 2025, measured against the 1991–2020 normal. Everything else is a deep graphite-ink ground that lets the stripes carry all the colour. The world has no decorative palette. Every hue on screen comes from one of two published diverging climate scales: RdBu (cold blue to warm red) for temperature, and BrBG (dry brown to wet teal) for rain and drought. A colour always means something about the climate. Colour never decorates.

The density is that of a field notebook on a dark desk. The layout uses elevated graphite panels with layered shadows. Strips of real stripes sit along card edges. Every number uses tabular figures. Type works in two voices. Archivo, a variable face with a width axis, is pushed wide and black for display and narrow for condensed labels and numbers. Atkinson Hyperlegible Next sets everything a teenager has to read. Interaction should feel like detective work. You scrub across the years to read a value. A selection ripples out in the colour of its case. Cards lift and tilt toward the pointer. Each screen enters with a wipe that looks like a stripe being drawn.

This world turns down two defaults. One is the space-navy-with-neon "NASA hackathon" look. The other is the cartoon education game. It must not feel childish, corporate or hard to read.

**Key Characteristics:**
- Graphite ground (`graphite-ground`); colour only from the RdBu and BrBG climate scales.
- Real-data climate stripes as hero, card edges, hub strip, results strip, logo lens and scene skies.
- Archivo across its width axis (125% display, 75–80% labels) with Atkinson Hyperlegible Next for reading.
- Elevated panels: a 1px hairline highlight plus a three-step soft layered shadow scale.
- Zone theming: Costa is blue, Centro is red, Norte is ochre. Each zone swaps one colour triad through the whole UI.
- Line icons drawn in code on a 24px grid, never emoji glyphs.
- Motion is ease-out-expo, interruptible and stagger-wiped, and it switches off fully under reduced motion.

## Colors

The ground is a near-black graphite with a cool cast. Every hue comes from the two diverging climate scales, so a colour always encodes temperature or water.

### Primary
- **Ember Action Red** (`action-red`): The only solid action fill: JUGAR / PLAY and every primary button. It sits between RdBu warm-2 and warm-3, so the main action reads as "warm" in the same scale as the data. White text on it passes AA (4.9:1).
- **Banked Ember** (`action-red-deep`): Hover and pressed state of the primary action. It goes darker, not brighter, and white text on it reaches 5.7:1.

### Secondary: RdBu temperature scale
An 11-step diverging ramp, `rdbu-cold-4` (Abyssal Blue) through `rdbu-neutral` (Normal White) to `rdbu-warm-4` (Furnace Maroon). The stripes interpolate across all 11 stops. One maximum covers all three cities, so the rows can be compared. In the UI:
- **Glacier Blue** (`rdbu-cold-1`): Link colour, focus ring, data dots and lines in charts, default badge text, `medal-none` icon.
- **Mid Blue / Deep Blue** (`rdbu-cold-2`, `rdbu-cold-3`): Costa zone accent and deep. "Colder than normal" bars, the early-decade series in the cycle chart, the selected segmented control on home and Costa, and the text-selection background.
- **Peach** (`rdbu-warm-1`): Sen-slope trend lines (dashed), the home subtitle, the decade-mean bars, the "new ending" badge, and the soft "bad" status ink.
- **Brick / Crimson** (`rdbu-warm-2`, `rdbu-warm-3`): Centro zone accent and deep. "Warmer than normal" bars, the late-decade series, the bad-answer line, the ending icon, and the red alert level.

### Tertiary: BrBG water scale
- **Dry Ochre / Umber** (`brbg-dry-1`, `brbg-dry-2`): Norte zone accent and deep, the "drier than normal" pole of rain charts, the surprise-event card and icon, and the "partly right" (mid) answer.
- **Sand** (`brbg-dry-0`): Norte zone highlight, warning badge text, bonus pill, "meh" item tag, and the mid status ink.
- **Sea-glass / Teal** (`brbg-wet-1`, `brbg-wet-2`): The "wetter than normal" pole, the correct-answer state, the preparedness bar, finished places, the big result percentage, and the "vital" item tag.

### Neutral
- **Graphite Ground** (`graphite-ground`): Page background, theme colour, header (at 94% opacity), the year-chip text.
- **Graphite Deep** (`graphite-deep`): Recessed wells: stripes hero backdrop, chart plot background, select and search fields, progress-bar track, segmented control tray, finished places.
- **Panel / Panel Raised / Panel High** (`panel`, `panel-raised`, `panel-high`): Three tonal steps of elevation. Cards and the status bar sit on the lowest. Secondary buttons, options, items and bubbles sit on the middle step. Hover fills and chips sit on the highest.
- **Hairline / Strong Hairline** (`line`, `line-strong`): 1px card borders and dividers, and control borders.
- **Ink / Soft Ink / Mute** (`ink`, `ink-soft`, `mute`): Primary text (17:1 on ground), secondary text and descriptions, captions and axis labels. Mute stays at or above 6.7:1 on every panel.

### Alert levels
`alert-yellow` and `alert-orange` are the only hues outside the two scales. They complete the five-level civil-protection alert banner (blue, green, yellow, orange, red), and the other three levels use scale steps (`rdbu-cold-1`, `brbg-wet-1`, `rdbu-warm-3`). Use them for alert levels and nothing else.

### Named Rules
**The Scale-Only Rule.** Every hue on screen is a step of RdBu or BrBG, applied with its meaning: blue and red mean colder and warmer, brown and teal mean drier and wetter. The single sanctioned exception is the alert-level banner. A new colour that encodes nothing about the climate does not enter the system.

**The Right Scale Rule.** Temperature is always RdBu. Rain and drought are always BrBG, with wet in teal for positive and dry in ochre for negative. Never draw rainfall in red and blue.

**The Zone Triad Rule.** A case sets one triad on the body (accent, highlight, deep): Costa uses `rdbu-cold-2` / `rdbu-cold-1` / `rdbu-cold-3`, Centro uses `rdbu-warm-2` / `rdbu-warm-1` / `rdbu-warm-3`, and Norte uses `brbg-dry-1` / `brbg-dry-0` / `brbg-dry-2`. Home defaults to Costa blue. Components read the triad and never hard-code a case colour. When white text sits on a zone fill, use the deep step (as the selected segmented control does), because white on the Costa accent is only 3.4:1.

## Typography

**Display Font:** Archivo (self-hosted variable woff2, weight 100–900, width 62–125%), falling back to system-ui
**Body Font:** Atkinson Hyperlegible Next (self-hosted variable woff2, weight 200–800, roman and italic), falling back to Segoe UI / system-ui
**Label/Mono Font:** Archivo again, narrowed to 75–80% width with tabular figures, so there is no separate mono face

**Character:** One grotesque used across its full width axis. Wide and black, it reads as a headline poster. Narrow and caps, it reads as an instrument label. Its numbers line up in columns. Next to it sits a typeface designed for legibility, so the reading voice is never the hard part.

### Hierarchy
- **Display** (900, width 125%, clamp(2.5rem, 7.2vw, 5.4rem), line-height 0.92, -0.025em): The game title on home only.
- **Headline** (900, width 118%, clamp(1.8rem, 4.4vw, 3rem), line-height 1): The case title in the hub.
- **Figure** (900, width 118%, clamp(3.6rem, 10vw, 5.6rem), tabular): The result percentage. It is coloured Sea-glass.
- **Title** (800, width 112%, clamp(1.35rem, 2.4vw, 1.7rem), line-height 1.15): Card and screen headings (h2). Balanced wrap.
- **Title Card** (800, width 108%, 1.18rem): Case-card names. City names in the stripes labels use 800 at width 112%.
- **Title Small** (750, width 100%, 1.06rem, line-height 1.3): Section headings (h3) inside cards, in the zone highlight colour, often led by an icon.
- **Body** (Atkinson 400, 17px, line-height 1.6; 16px under 520px): All reading text, capped at 70ch, with leads at 52ch.
- **Body Small** (Atkinson, 0.9rem, line-height 1.5, Mute): Captions, notes, how-to-read lines under charts.
- **Button** (Archivo 650, 1rem) / **Button Hero** (850, width 115%, 1.15rem, uppercase, 0.06em): The hero button is the only uppercase action.
- **Label Caps** (750, width 75%, 0.86rem, uppercase, 0.06em): Badges. **Label** (650, width 80%, 0.86rem): Chips, axis years, stripe rates.
- **Numeric** (Archivo 600–700, tabular figures): Every value, rate, year, clock and score.

### Named Rules
**The Width Axis Rule.** Hierarchy comes from width as well as weight. Display runs at 112–125% width, labels and numbers at 75–80%, and buttons and reading-adjacent UI at 100%. Use `font-stretch` on the self-hosted Archivo. Do not swap faces or fake width with letter-spacing.

**The Tabular Figures Rule.** Any number a player compares, whether a rate, anomaly, year, score or clock, is set in tabular figures so that columns and scrubbed readouts don't jitter.

**The Reading Voice Rule.** Paragraphs, options, item names and glossary entries use Atkinson Hyperlegible Next. Archivo never sets running text.

## Layout

Phone-first, single column. Screens are a grid with 18px gaps, inside a centred column of `max-width` (1040px) plus the fluid `gutter` (clamp(16px, 4vw, 40px)) on each side. Home is the one full-bleed surface. The stripes hero spans the viewport at clamp(210px, 40vh, 400px) tall, with three rows split by 3px graphite gaps. Below it sit an axis (first year, a moving year chip, last year) and a legend row. Everything after the hero returns to the centred column.

Breakpoints, as built:
- **≤520px:** body drops to 16px. Stripe labels stack the city over the rate. The legend stacks. Places go to two columns with 10px gaps. Chart text grows to 14px so the 360-unit SVG viewBox stays readable once it is scaled down.
- **≥640px:** archive controls go to two columns, with the period fieldset spanning both. The status bar goes to three columns (two stats plus the alert).
- **≥860px:** the home intro splits 1.5fr / 1fr with a 48px gap, with title and lead on the left and actions on the right, bottom-aligned. The case cards go to three columns.

Spacing rhythm is a tight 4–6–10–14–18–24 ladder. Use 10px between stacked controls, 14–16px between cards, 18px between screen blocks, and the fluid `card` padding (18–30px) inside cards. Grids of places and items use `auto-fill` with 160px and 150px minimums.

### Named Rules
**The Full-Bleed Data Rule.** Only data goes edge to edge. The stripes hero is the single full-bleed band. Panels, text and controls stay in the centred column.

## Elevation & Depth

A lifted system on a dark ground. Depth comes from three tonal panel steps, each of which also carries a soft layered shadow and a 1px inner top highlight (`inset 0 1px 0 rgba(255,255,255,.05)`). Shadows are always black, always diffuse, and always stacked as a tight contact shadow plus one or two long negative-spread falloffs. They respond to state. A resting card sits on step 2, hovering raises it to step 3, and pressing drops it to step 1.

### Shadow Vocabulary
- **Rest-low** (`0 1px 2px rgba(0,0,0,.35), 0 2px 6px -1px rgba(0,0,0,.3)`): Buttons, options, items, the language toggle, bubbles, alerts, readouts.
- **Rest-card** (`0 1px 2px rgba(0,0,0,.4), 0 6px 14px -4px rgba(0,0,0,.45), 0 18px 36px -12px rgba(0,0,0,.55)`): Cards, case cards, places, the status bar, stripe labels. Also the hover state of small controls.
- **Lifted** (`0 2px 4px rgba(0,0,0,.4), 0 14px 28px -8px rgba(0,0,0,.55), 0 34px 64px -18px rgba(0,0,0,.7)`): Hovered case and place cards, the hovered clue, the cinematic frame.
- **Highlight** (`inset 0 1px 0 rgba(255,255,255,.05)`): Paired with every panel shadow, so panels catch light on their top edge.
- **Primary press** (inner top light at 18%, inner bottom shade 2px at 18%, plus `0 2px 4px` and `0 10px 24px -8px` black): The primary button is shaped like a key cap. On hover the falloff deepens to `0 18px 34px -10px`.

### Named Rules
**The Soft Stack Rule.** Every shadow is a blurred stack in pure black with negative spread on the long layer. No hard offset shadows, no coloured glows, and no single-layer drop shadows.

**The Lift-on-Intent Rule.** Shadows only grow in answer to the pointer or a selection. A static surface never sits at the Lifted step, except the cinematic frame, which is a stage.

## Shapes

Gently rounded rectangles with a strict radius ladder. Use `md` (14px) for cards, case cards, places, the status bar, the cinematic frame and the clue. Use `sm` (10px) for buttons, options, items, fields, quotes and fieldsets. Use `tile` (12px) for icon tiles and the segmented tray, where the selected segment is 9px. Use `xs` (6px) for readouts, the year chip, chart tooltips and the focus-ring corner. Use `full` for pills, chips, badges, tags, the language toggle and progress bars.

Data stays square. Stripe rows, the hub strip and the results strip have no radius, apart from the hub strip's 3px. Card-edge strips are clipped by the card's own corners. The guide's speech bubble has one sharp corner (4px) toward the avatar. The avatar and the ending icon are circles. Borders are 1px hairlines everywhere, except the tutorial clue, which uses a 2px dashed zone-coloured border that turns solid on hover.

## Components

### Buttons
Tactile key caps that rise on hover and sink on press.
- **Shape:** gently rounded (`rounded.sm`, 10px), minimum height 50px (62px for the hero, 56px for the wide secondary).
- **Primary:** Ember Action Red fill, white text, Archivo 800, with the key-cap shadow. **Hero** variant: full width, uppercase, width 115%, 0.06em tracking. It is used once per screen, for JUGAR / PLAY.
- **Secondary:** Panel Raised fill, Strong Hairline border, Ink text, Rest-low shadow plus highlight.
- **Ghost:** no fill, border or shadow, in Soft Ink. Hover fills Panel Raised and shows the border. Used for back and for footer-level links (Glossary, Method).
- **Hover / Focus / Active:** hover lifts by 2px (0.35s, expo-out), turns the border to the zone accent and steps the shadow up to Rest-card. Active presses back to 0 with scale 0.975 in 0.08s. Every pressable sends a white radial ripple out from the press point (0.65s). Disabled controls drop to 45% opacity with no shadow, and a disabled primary goes to Panel High with Mute text.
- **Segmented control (chart types):** a Graphite Deep tray (12px) holding 40px segments. The selected segment fills with the zone's deep step and white text.
- **Language toggle:** a pill (`rounded.full`), Archivo 700, 44px tall, with a Glacier Blue border on hover.

### Chips, Badges, Pills and Tags
- **Chip:** a Panel High pill in Archivo Label (80% width), Soft Ink. Metadata on case cards (hours, difficulty, endings), sometimes with a leading icon.
- **Badge:** a status marker. Pill shape, zone accent at 18% fill and 45% border, zone-highlight text in Label Caps (75% width, uppercase). Variants: **warn** (Sand on ochre tint, for the surprise event) and **new** (Peach on peach tint, for a newly found ending). Badges name a state or a category of what is beside them. They are not decorative headers.
- **Pill:** a Panel Raised capsule in body text for running state (tutorial step, backpack count). The **bonus** pill uses the Sand tint.
- **Tag:** small uppercase capsules with dark text (`graphite-ground`) on a scale colour. They grade items: vital = Sea-glass, useful = Glacier Blue, meh = Sand, useless = Mute, risky = Peach.

### Cards / Containers
- **Corner Style:** `rounded.md` (14px).
- **Background:** Panel. Event cards mix in 9% ochre with a Sand border, and ending cards mix in 8% Brick with a Peach border.
- **Shadow Strategy:** Rest-card plus highlight (see Elevation).
- **Border:** 1px Hairline.
- **Internal Padding:** fluid `card` spacing (18–30px). Headings inside stack at 10–12px.
- **Status bar:** the same panel in a 1-column grid that becomes 3 columns, with Archivo labels led by icons over 10px pill progress bars. The time bar uses the zone accent and the preparedness bar uses Teal.
- **Case file (disclosure):** a Panel card with a 50px summary row whose chevron (an SVG mask) rotates 180° when open.

### Tilt Cards (case cards and places)
The signature surface. A 58px real-data stripe strip forms the top edge of each case card, and the strip scales up 12% vertically on hover. Below it are a 46px tinted icon tile (zone at 20% over Panel Raised, with a 45% inner ring), a 40px round arrow tag that fills with the case colour and slides 3px on hover (or a medal once earned), the title, the description and chips. On fine pointers the card tilts toward the cursor, up to ±3° on Y and ±2.5° on X in a 900px perspective, and lifts 5px. A soft white radial light follows the pointer, and the shadow deepens to Lifted. The border takes the case colour. Places use the same behaviour in a 132px tile with an icon tile that tips -6° and fills solid on hover. Finished places sink to Graphite Deep with a Teal icon and cost, and unaffordable places fade to 45%.

### Options and Items
- **Option (answer):** a 52px Panel Raised row in body text, Rest-low. Hover slides 4px right, fills Panel High and borders in the zone accent. Answer states keep the tint plus a 1px inner ring. **Good** is Teal on a teal tint with a drawn check. **Bad** is Brick on a red tint with a drawn cross and a 0.45s shake. **Mid** is Ochre on an ochre tint. Picking plays a 0.55s "pick" pop (scale from 0.95 with a brightness flash).
- **Item (backpack):** a 56px tile in an `auto-fill` 150px grid, an icon plus a name. **On** state: zone tint at 22%, a zone-highlight inner ring and border, and a zone-highlight icon. The ripple takes the card's case colour.

### Stripes Hero
Three stacked rows, one per city, coloured on the shared RdBu maximum. Each row is a button that opens its case. A floating label in Graphite Deep at 84% opacity shows the city name (800, width 112%) and its Sen slope per decade (Label, tabular), and nudges 4px on row hover. Hovering the band desaturates the other rows to 75% saturation and 80% brightness. Scrubbing with the pointer, touch or arrow, Home and End keys draws a 2px white cursor line with a dark keyline. Each row then shows a readout chip with the year's swatch and its signed anomaly, which flips to the left after 72% of the width. A year chip in Ink on Graphite Ground tracks along the axis, and a polite live region announces the values. On load the rows wipe in, staggered by 0.12s, and the cursor sweeps once across 45 years (1.7s, cubic ease-out, after a 1.15s delay) and rests on the latest year. While data loads, a shimmering skeleton holds the band's height.

### Stripe Strips
Non-interactive stripe SVGs reuse the hero's colour function. They appear at the case-card top edge (58px), as the hub header strip (16px, 3px radius, Rest-low) and as the results-card header strip (44px, bleeding to the card edges). Each wipes in over 1.1s. The logo is a magnifier whose lens holds seven RdBu stripes, and the favicon repeats it.

### Charts (Detective's Archive and data clues)
Every chart is an SVG drawn into a 360×230 viewBox, on Graphite Deep with a Hairline border and `rounded.sm`. Gridlines are Soft Ink at 12%. Axis text is Archivo with tabular figures, in Mute, and value labels are Ink 700. There are five types. **Line** shows Glacier Blue dots with a faint polyline and a dashed Peach Sen trend line. **Anomaly** shows bars on the variable's diverging poles around a zero axis. **Stripes** blends from a graphite mid-tone to each pole. **Decades** shows faint dots with thick Peach decade-mean bars, dashed when a decade is partial. **Cycle** compares the early decade in Mid Blue with the late decade in Brick, labelled directly. A crosshair tooltip (dashed white line, Ink capsule with Graphite text, 6px radius) snaps to the nearest mark on pointer or tap. Under every chart sit a legend of swatches, dots and dashes and a Body Small how-to-read line. The verdict panel tints toward Brick for an upward trend and Mid Blue for a downward one, and stays neutral when there is no trend.

### Inputs / Fields
- **Style:** Graphite Deep fill, Strong Hairline border, `rounded.sm`, 50px tall (52px for search), and a drawn chevron or magnifier as a background SVG. The field labels above are Archivo 650 in Soft Ink.
- **Focus:** the border turns Glacier Blue, with a 3px Glacier Blue halo at 35%. Hover borders in the zone accent.

### Navigation
A sticky header in Graphite Ground at 94% opacity with a Hairline bottom border. The brand button (logo plus Archivo 800, width 112%) returns home, and its logo tilts -12° and scales to 1.08 on hover. The language toggle sits to the right. There is no other chrome. Navigation within a screen uses ghost back buttons.

### Cinematic
A framed stage (`rounded.md`, Lifted shadow, Hairline border, clamp(380px, 58vh, 520px)) that unwipes from the top over 0.8s. The scene sky is the case city's real stripes. They are muted when calm (72%), nearly hidden in a storm (16%) and at full strength in a heat alert (95%). Graphite ridge silhouettes sit below, outlined in the zone highlight. Scenes move with Ken Burns (9s), drifting stratus lines, falling rain, orbiting sun rays and a spinning cyclone icon. A floating 64px icon disc sits top-left. The narration is Archivo 700 over a gradient to Graphite Deep and rises in. Progress dots go from white at 25% to solid white.

### Guide and Clue (tutorial)
A 54px circular avatar in the zone deep step, with a double ring (panel plus zone at 55%), beside a Panel Raised speech bubble with one sharp corner. The clue is a dashed zone-coloured card. A beacon outline pulses around it (2.2s), and on hover it lifts 3px, tilts -0.4° and turns its border solid.

### Icons
Line icons drawn in code on a 24×24 grid with a 1.8 stroke, round caps and joins, no fill, in `currentColor`, sized 1.25em and nudged -0.25em on the baseline. Inside tiles they are 22–34px. The emoji keys in the game data map to drawn icons, and leading emoji in i18n strings are swapped for icons when the text is applied. Medals are drawn as gold, silver or bronze discs on an RdBu ribbon. Icons are always `aria-hidden` next to visible text.

## Do's and Don'ts

### Do:
- **Do** draw every new hue from RdBu (temperature) or BrBG (rain and drought) with its meaning intact. Blue is colder, red is warmer, ochre is drier, teal is wetter.
- **Do** read the zone triad (accent, highlight, deep) instead of hard-coding a case colour, and use the deep step under white text.
- **Do** compute stripes from real NASA POWER series against the 1991–2020 normal, on one shared maximum when rows are compared.
- **Do** set every compared number in Archivo with tabular figures, and all reading text in Atkinson Hyperlegible Next at 17px / 1.6 or larger, capped at 70ch.
- **Do** use the width axis for hierarchy: 112–125% for display, 75–80% for labels.
- **Do** pair every panel with the 1px top highlight and a Soft Stack shadow. Step it up on hover and down on press.
- **Do** keep touch targets at least 44px (buttons 50px, options 52px, items 56px), visible 3px Glacier Blue focus rings at a 3px offset, and keyboard scrubbing (arrows, Home, End) with a live readout on any stripe band.
- **Do** use the shared ease-out-expo curve `cubic-bezier(.16,1,.3,1)` for state and entrance motion, and make every animation and transition stop under `prefers-reduced-motion`. Tilt resets to flat, the hero cursor sweep is skipped, and ripples are not created.
- **Do** neutralise hover lifts and tilts on `hover: none` devices.
- **Do** draw icons as 24px line SVGs (1.8 stroke, round caps) in `currentColor`.

### Don't:
- **Don't** introduce a colour that encodes nothing about the climate. The only exception is the alert-level yellow and orange.
- **Don't** draw rainfall in RdBu or temperature in BrBG.
- **Don't** drift toward space-navy with neon glows, or toward cartoon edu-game styling. The tone must not read as childish, corporate or hard to read.
- **Don't** use hard offset shadows, coloured glows or single-layer drop shadows.
- **Don't** run Archivo as body text, or reach for a system face for display.
- **Don't** render emoji as icons. Map them to drawn line icons.
- **Don't** put uppercase condensed labels above headings as eyebrows. Badges mark a state or category next to content.
- **Don't** put white text on the mid-step zone accents (white on the Costa accent is 3.4:1). Use the deep step.
- **Don't** let anything but data go full-bleed.
