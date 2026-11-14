#!/usr/bin/env python3
"""Download monthly NASA POWER series (T2M, PRECTOTCORR) for the 3 cities
and save them as compact JSON in data/. Source: NASA POWER (MERRA-2 / IMERG-corrected).
Usage: python3 scripts/fetch_power.py
"""
import json, os, urllib.request, datetime

CITIES = {
    "veracruz":  {"name": "Veracruz",  "region": "coast",  "lat": 19.18, "lon": -96.14},
    "pachuca":   {"name": "Pachuca",   "region": "center", "lat": 20.12, "lon": -98.73},
    "monterrey": {"name": "Monterrey", "region": "north",  "lat": 25.67, "lon": -100.31},
}
END_YEAR = datetime.date.today().year
OUT = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(OUT, exist_ok=True)

def fetch(c):
    url = ("https://power.larc.nasa.gov/api/temporal/monthly/point"
           f"?parameters=T2M,PRECTOTCORR&community=AG&longitude={c['lon']}"
           f"&latitude={c['lat']}&start=1981&end={END_YEAR}&format=JSON")
    with urllib.request.urlopen(url, timeout=120) as r:
        return json.load(r)

def series(par):
    # keys YYYYMM; MM=13 is the annual mean -> skip. -999 = missing -> None
    out = {}
    for k, v in par.items():
        y, m = int(k[:4]), int(k[4:])
        if m == 13:
            continue
        out[(y, m)] = None if v == -999 else v
    return out

result = {}
for cid, c in CITIES.items():
    j = fetch(c)
    p = j["properties"]["parameter"]
    t2m, pr = series(p["T2M"]), series(p["PRECTOTCORR"])
    keys = sorted(k for k in t2m if t2m[k] is not None or pr.get(k) is not None)
    # trim trailing months with no data
    while keys and t2m[keys[-1]] is None and pr.get(keys[-1]) is None:
        keys.pop()
    first, last = keys[0], keys[-1]
    # contiguous monthly arrays starting at first
    months = []
    y, m = first
    while (y, m) <= last:
        months.append((y, m)); m += 1
        if m == 13: y, m = y + 1, 1
    result[cid] = {
        "name": c["name"], "region": c["region"], "lat": c["lat"], "lon": c["lon"],
        "elevation_m": j["geometry"]["coordinates"][2],
        "start": [first[0], first[1]], "end": [last[0], last[1]],
        "t2m": [t2m.get(k) for k in months],        # degrees C, monthly mean
        "prectotcorr": [pr.get(k) for k in months], # mm/day, monthly mean
    }
    print(cid, first, last, len(months), "months; missing T2M:",
          sum(v is None for v in result[cid]["t2m"]))

meta = {
    "source": "NASA POWER API (https://power.larc.nasa.gov), monthly, community AG",
    "variables": {"t2m": "T2M, temperature at 2 m (C)", "prectotcorr": "PRECTOTCORR, bias-corrected precipitation (mm/day)"},
    "retrieved": datetime.date.today().isoformat(),
    "note": "Grid-cell values (~0.5 x 0.625 deg), not station data.",
}
with open(os.path.join(OUT, "series.json"), "w") as f:
    json.dump({"meta": meta, "cities": result}, f, separators=(",", ":"))
print("wrote data/series.json")
