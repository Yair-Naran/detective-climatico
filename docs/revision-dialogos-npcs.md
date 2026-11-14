# Revisión científica de `i18n/dialogos_npcs.json`

Revisado contra nuestros datos (`data/series.json`, NASA POWER 1981–2025, Mann-Kendall) y las fuentes del proyecto. Los jueces califican **Validez**: ninguna línea del juego puede contradecir lo que muestra el Archivo del detective.

**Estado:** el archivo está en el repo tal cual. **Todavía no se carga en el juego.** El Caso Norte ya usa a Ing. Sofía Garza, Don Homero, la Abuela Chayo y Mateo, pero con textos corregidos (en `i18n/strings.js`). Antes de meter los demás diálogos, hay que corregir lo siguiente.

## Lo que contradice nuestros datos (corregir sí o sí)
| ID | Problema | Corrección sugerida |
|---|---|---|
| `norte.radio_headline` | Dice que las series de lluvia de largo plazo muestran estrés hídrico severo. **Nuestros datos no muestran tendencia** en la lluvia anual de Monterrey (+0.014 mm/día por década, p = 0.84). | "La lluvia de Monterrey cambia mucho de un año a otro: 2010 fue el año más lluvioso de la serie y 2011 el más seco." |
| `norte_npc_4` (Carla) | "Eso nos dice cuánta agua tendremos en 2030." Una tendencia no predice el agua disponible, y la de lluvia ni siquiera es significativa. | "…revisamos la pendiente y el valor p. Así sabemos qué está cambiando y qué no, para planear con cuidado." |
| `costa_npc_3` + `costa_int_2` (Capitán Ríos) | Activar alertas o cerrar el puerto por una tendencia de 40 años es incorrecto: las alertas se basan en pronósticos (SIAT-CT). Además, la lluvia promedio de Veracruz **no** tiene tendencia significativa (p ≈ 0.35). | "Para las alertas uso el pronóstico y el SIAT-CT. Las tendencias me sirven para planear a largo plazo: refugios, drenaje, presupuesto." |
| `costa_npc_1` (Don Tacho, askMore) | Llama a T2M "temperatura de la superficie" y dice que su aumento calienta el mar. T2M es la temperatura del **aire** a 2 m, y nuestro dato no mide el mar. | "T2M es la temperatura del aire. El mar no lo medimos aquí, pero el aire más caliente guarda más vapor de agua y los aguaceros pueden ser más fuertes." |
| `costa_int_1` (Dr. Fabián) | "Coincide exacto con la curva de calentamiento de los satélites": nuestro dato es aire sobre tierra, no océano. | "…coincide con lo que vemos en el aire: Veracruz se calentó +0.19 °C por década desde 1981." |
| `costa_npc_5` / `resolution` | "Los satélites miden celdas de 50 km." MERRA-2 es un **reanálisis** (modelo + observaciones), no una medición directa de satélite. | "NASA POWER combina modelos y observaciones (incluidos satélites) en celdas de ~50 km." |

## Afirmaciones que conviene matizar
| ID | Problema | Sugerencia |
|---|---|---|
| `norte_npc_3` (Don Homero, askMore) | "El cambio climático… altera las estaciones" con frentes árticos más intensos: es tema debatido. El IPCC dice que los extremos de frío son **menos** frecuentes. En Monterrey los inviernos se calientan (+0.42 °C por década, p ≈ 0.002). | "Los inviernos se calientan en promedio, pero los frentes fríos siguen llegando. Hay que prepararse igual." |
| `centro_int_1` (Enfermera Lupita) | "Las temperaturas máximas han subido": no lo mostramos (usamos medias; MERRA-2 subestima las máximas). Además, el horario oficial de Salud es 11:00–16:00, no 12–4. | "…la temperatura promedio ha subido. No patinen entre las 11 y las 4." |
| `centro_npc_3` (Arquitecta Elena) | Calcular el grosor del aislante con la pendiente es exagerado. | "Con esa tendencia justificamos diseñar escuelas más frescas." |
| `norte_int_1` (Abuela Chayo) | "Baja hasta cinco grados": cifra no verificada. | "Bajo el mezquite se siente más fresco sin gastar agua." |
| `costa.radio_headline` | "Decenas de municipios arrastran déficits históricos de lluvia": no verificado. | Quitar, o marcarlo como noticia ficticia. |
| `PRECTOTCORR.short_desc` | "Corregida y validada por satélites de la NASA." | "Lluvia estimada por NASA POWER (MERRA-2) y corregida con observaciones de satélite (GPM IMERG)." |

## Otras notas
- **Personajes menores (Santi, 15 años; Mateo; Valeria):** la regla de Space Apps prohíbe imagen, video o voz de menores **reales**. Personajes ficticios de texto y sin rostro deberían estar bien, pero nuestra decisión inicial fue "sin menores representados". Confírmenlo como equipo. En el Caso Norte, Mateo aparece solo como texto.
- `meta.author_ref`: está bien citar al Dr. Aker como autor del reto, pero sin sugerir que respaldó el proyecto.
- Lo que está muy bien y conviene usar tal cual: Profe Aréchiga (promedio mensual vs. amplitud térmica), Enfermera Lupita (p > 0.05 con pocos años) e Ing. Sofía ("confundir una tormenta aislada con el fin de la sequía").
