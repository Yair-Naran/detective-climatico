# Tareas del equipo (sáb 14 – dom 15 nov)

Reparto actualizado: la integrante menor no puede participar por ahora, así que su contenido lo cubren Naranjo y el compañero. Claude ya redactó las definiciones y la explicación de tendencia/significancia (`i18n/strings.js`). **Revísenlas** en vez de escribirlas desde cero.

Regla: todo texto del juego va en `i18n/strings.js` (ES y EN). Nada de texto escrito directo en HTML/JS.

## Compañero (arte, video, voz)
- [ ] Arte y personajes (sin rostro realista, sin menores). Fuentes CC0/propias. Anotar CADA asset en `ASSETS.md` (nombre, fuente, licencia, URL).
- [ ] Paleta y estilo para tarjetas, ilustraciones de Costa/Centro/Norte, íconos de refugio.
- [ ] Cinemática de consecuencias (≤20 s, cuadros ilustrados).
- [ ] Video demo ≤30 s: debe mostrar nombre del equipo, integrantes y reto; subtítulos en inglés; sin imagen/voz de menores; sin marca NASA.
- [ ] Imágenes para la página de entrega (JPG/PNG/GIF ≤10 MB).

## Naranjo (contenido + revisión científica)
- [ ] Revisar las definiciones y el texto de "Método y fuentes" (¿lo entiende un chico de 12 años? ¿es correcto?).
- [ ] Hacer a mano los 3 casos de `docs/casos-prueba.md` y compararlos con `docs/respuestas-casos.md` y con la herramienta.
- [ ] Contenido narrativo de Costa (Veracruz): 1 historia corta, 4–5 titulares de noticias, 1 mensaje de radio, 2 NPC con consejos de preparación. Datos reales: usar lo que muestra el Archivo (ver abajo).
- [ ] Guion del demo de 30 s (en inglés) y borrador de los textos de entrega (Claude los traduce/pule).

## Hallazgos reales para las historias (de los datos NASA POWER, 1981–2025, promedio anual)
| Ciudad | Variable | Cambio por década | Significativo (p<0.05) |
|---|---|---|---|
| Veracruz | Temperatura | +0.19 °C | Sí (p≈0.0006) |
| Veracruz | Lluvia | +0.09 mm/día | No (p≈0.35) |
| Pachuca | Temperatura | +0.43 °C | Sí (p<0.001) |
| Pachuca | Lluvia | −0.25 mm/día | Sí (p≈0.0004) |
| Monterrey | Temperatura | +0.37 °C | Sí (p<0.001) |
| Monterrey | Lluvia | +0.01 mm/día | No (p≈0.84) |

Ojo con las historias: en Veracruz y Monterrey **no** hay tendencia significativa en lluvia **promedio**. Los eventos extremos (inundaciones, ciclones, sequías) no se prueban con medias anuales: cuéntenlos como contexto, y no digan que "los datos prueban" más intensidad de lluvia.

## Claude
Repositorio, datos, Archivo del detective, tutorial + Nivel Costa, i18n, Centro/Norte, textos de entrega en inglés, lista de Referencias y "Use of SI".

## Pendiente de diseño (pedido por Naranjo)
- [ ] **Cambiar el diseño a uno más llamativo** (colores, tipografía, ilustraciones en lugar de emojis). Los emojis son marcadores temporales: cada lugar y escena tiene un `icon` en `js/levels-data.js`, y los estilos están en `css/style.css`.

## Diálogos de NPC
- `i18n/dialogos_npcs.json` ya está en el repo. **Antes de usarlo en el juego**, aplicar las correcciones de `docs/revision-dialogos-npcs.md` (6 líneas contradicen nuestros datos).

## Cómo está armado el juego (para editar contenido)
- Textos de los casos: `i18n/strings.js`, claves `costa_*`, `centro_*` y `norte_*` (ES y EN).
- Lugares, tiempos, puntos y medallas: `js/levels-data.js`. Los tres casos usan el mismo molde.
- Enlaces directos: `?lang=en` (jueces), `#archivo` (herramienta), `#costa` (nivel), `#tutorial`.

## Pendiente de confirmar
- Hora real del juicio local (¿antes de las 12:59 del domingo o 23:59?).
- Si el nombre de la integrante menor puede aparecer en el demo (pregunta al Local Lead; no puede aparecer su imagen ni voz).
