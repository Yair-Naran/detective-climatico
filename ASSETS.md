# Registro de recursos (para el campo "References" y "Use of SI")

Anotar TODO lo usado (código, texto, imágenes, audio, librerías), aunque sea libre.

## Datos
| Recurso | Fuente | Licencia / términos | URL |
|---|---|---|---|
| Series mensuales T2M y PRECTOTCORR | NASA POWER (MERRA-2; precipitación corregida con GPM IMERG) | Datos abiertos de NASA | https://power.larc.nasa.gov |

## Código
| Recurso | Autor | Licencia | Nota |
|---|---|---|---|
| js/stats.js, js/archive.js, index.html, css/ | Equipo, escrito con ayuda de Claude (IA) | MIT | Declarar uso de IA en "Use of SI". Mann-Kendall validado contra scipy. |

## Contenido de preparación (texto propio basado en)
| Fuente | Uso |
|---|---|
| SIAT-CT, Sistema Nacional de Protección Civil (manual 2019, gob.mx) | Alertas de 5 colores en el Caso Costa |
| Protección Civil / CENAPRED, mochila de emergencia | Objetos de la mochila (72 h) |
| IPCC AR6 WGI (2021), cap. 11 | Lluvia en ciclones, proporción de ciclones intensos, marea de tormenta; extremos de calor más frecuentes desde 1950 |
| Servicio Meteorológico Nacional (Conagua) / CENAPRED | Definición de onda de calor (Caso Centro) |
| Monitor de Sequía de México (Conagua – SMN) | Categorías D0–D4 (Caso Norte) |
| Secretaría de Salud | Recipientes de agua limpios y tapados (Caso Norte) |
| Protección Civil Nuevo León | No usar anafres ni braseros dentro de casa (Caso Norte) |
| Secretaría de Salud | Evitar sol 11:00–16:00, señales y primeros auxilios de golpe de calor, llamar al 911 (Caso Centro) |

## Contenido del equipo
| Recurso | Autor | Nota |
|---|---|---|
| `i18n/dialogos_npcs.json` | Equipo | Diálogos de NPC (ES/EN); ver `docs/revision-dialogos-npcs.md` |
| `scripts/fetch_nasa_power.py` | Equipo | Descarga cruda de NASA POWER |

## Arte / audio
Ilustraciones, logo y paisajes animados: originales, dibujados en código SVG/CSS (`js/art.js`, `css/style.css`), sin archivos de imagen ni fotos de personas. Íconos pequeños: emojis del sistema del dispositivo del usuario (no se distribuyen archivos). El arte final del compañero (personajes dibujados, estilo animado, sin parecido a personas reales ni a menores) se registra aquí con autor y herramienta.
| Recurso | Fuente | Licencia | URL | Archivo en repo |
|---|---|---|---|---|
| (vacío) | | | | |

## Uso de IA (Use of SI)
- Código y textos del juego redactados con Claude (Anthropic).
- Ilustraciones del juego (`js/art.js`): código SVG escrito con ayuda de Claude; no son imágenes generadas por IA.
- Imágenes generadas por IA: ninguna hasta ahora (si se usan: marca de agua visible y declararlas aquí).
