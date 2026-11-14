# Scripts de datos

| Script | Salida | Uso |
|---|---|---|
| `fetch_power.py` | `data/series.json` (formato compacto) | **El que usa el juego.** Correr desde la raíz del repo: `python3 scripts/fetch_power.py` |
| `fetch_nasa_power.py` | `nasa_power_data.json` en la carpeta donde se corra (respuesta cruda de la API) | Herramienta del equipo para explorar los datos crudos. El juego no lo lee. |

Ambos descargan T2M y PRECTOTCORR mensuales de NASA POWER desde 1981 para Veracruz, Pachuca y Monterrey. Solo usan la biblioteca estándar de Python.

Notas sobre la salida cruda de `fetch_nasa_power.py`:
- Las claves con mes `13` (ej. `202513`) son el **promedio anual**, no un mes.
- Los faltantes vienen como `-999`.
