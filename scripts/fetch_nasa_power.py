#!/usr/bin/env python3
"""
Script para descargar las series mensuales de NASA POWER (1981-presente)
Ciudades: Veracruz (Costa), Pachuca (Centro), Monterrey (Norte)
Variables: T2M (Temperatura a 2m), PRECTOTCORR (Precipitacion corregida)
"""
import json
import urllib.request

CITIES = {
    "costa": {"name": "Veracruz", "lat": 19.1738, "lon": -96.1342},
    "centro": {"name": "Pachuca", "lat": 20.1011, "lon": -98.7591},
    "norte": {"name": "Monterrey", "lat": 25.6866, "lon": -100.3161}
}

START_YEAR = 1981
END_YEAR = 2025
PARAMETERS = "T2M,PRECTOTCORR"

def fetch_city_data(key, info):
    url = (
        f"https://power.larc.nasa.gov/api/temporal/monthly/point?"
        f"parameters={PARAMETERS}&community=SB"
        f"&longitude={info['lon']}&latitude={info['lat']}"
        f"&start={START_YEAR}&end={END_YEAR}&format=JSON"
    )
    print(f"Descargando {info['name']} ({url})...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = json.loads(resp.read().decode("utf-8"))
    return raw["properties"]["parameter"]

def main():
    output = {
        "metadata": {
            "source": "NASA POWER API (MERRA-2 / IMERG)",
            "resolution": "0.5 deg x 0.625 deg",
            "variables": {
                "T2M": "Temperature at 2 Meters (C)",
                "PRECTOTCORR": "Precipitation Corrected (mm/day)"
            }
        },
        "cities": {}
    }
    for key, info in CITIES.items():
        params = fetch_city_data(key, info)
        output["cities"][key] = {
            "name": info["name"],
            "lat": info["lat"],
            "lon": info["lon"],
            "data": params
        }
    with open("nasa_power_data.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print("Listo: nasa_power_data.json generado con exito.")

if __name__ == "__main__":
    main()
