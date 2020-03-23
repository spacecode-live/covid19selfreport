import geojson
import json
from shapely.geometry import shape, Point
from shapely.ops import unary_union
import pandas as pd

f = open("plz/plz2kreis.json")
plz2kreis = json.load(f)
f.close()

f = open("plz/plz5stellig2kreis.json")
plz5stellig2kreis = json.load(f)
f.close()

def plz2longlat(plz):
    df = pd.read_csv("plz/PLZ.tab", sep="\t", dtype=str, skiprows=0)
    lon, lat = df.loc[df.plz == plz,["lon","lat"]].iloc[0,:]
    return float(lon), float(lat)

def plz_exists(plz):
    return plz in plz2kreis.keys()

def f_plz5stellig2kreis():
    f = open("plz/plz-5stellig.geojson")
    data = json.load(f)
    f.close()

    f = open("static/landkreise_simplify200.geojson")
    landkreise = json.load(f)
    f.close()

    plz2kreis = {}

    for kreis in landkreise["features"]:
        kreispolygon = shape(kreis["geometry"])
        for feature in data["features"]:
            plz = feature["properties"]["plz"]
            point = shape(feature["geometry"]).centroid
            if point.within(kreispolygon):
                kreisname = kreis["properties"]["BEZ"] + ' ' + kreis["properties"]["GEN"]
                if plz in plz2kreis.keys() and plz2kreis[plz] != kreisname:
                    print(f"conflict: {plz} is already in {plz2kreis[plz]} when trying to add to {kreisname}")
                plz2kreis[plz] = kreisname
    with open('plz/plz5stellig2kreis.json', 'w') as json_file:
        json.dump(plz2kreis, json_file)

def f_tab2kreis():
    df = pd.read_csv("plz/PLZ.tab", sep="\t", dtype=str, skiprows=0)
    f = open("static/landkreise_simplify200.geojson")
    kreisn = json.load(f)
    f.close()

    plz2kreis = {}

    for kreis in kreisn["features"]:
        polygon = shape(kreis["geometry"])
        for i in range(len(df)):
            row = df.iloc[i]
            plz = row["plz"]
            lon = float(row["lon"])
            lat = float(row["lat"])
            point = Point([lon,lat])
            if point.within(polygon):
                kreisname = kreis["properties"]["BEZ"] + ' ' + kreis["properties"]["GEN"]
                if plz in plz2kreis.keys() and plz2kreis[plz] != kreisname:
                    print(f"conflict: {plz} is already in {plz2kreis[plz]} when trying to add to {kreisname}")
                plz2kreis[plz] = kreisname
    with open('plz/plz2kreis.json', 'w') as json_file:
        json.dump(plz2kreis, json_file)

def f_tab2gemeinde():
    df = pd.read_csv("plz/PLZ.tab", sep="\t", dtype=str, skiprows=0)
    f = open("static/gemeinden_simplify200.geojson")
    gemeinden = json.load(f)
    f.close()

    plz2gemeinde = {}

    for gemeinde in gemeinden["features"]:
        polygon = shape(gemeinde["geometry"])
        for i in range(len(df)):
            row = df.iloc[i]
            plz = row["plz"]
            lon = float(row["lon"])
            lat = float(row["lat"])
            point = Point([lon,lat])
            if point.within(polygon):
                gemeindename = gemeinde["properties"]["BEZ"] + ' ' + gemeinde["properties"]["GEN"]
                print(gemeindename)
                if plz in plz2gemeinde.keys() and plz2gemeinde[plz] != gemeindename:
                    print(f"conflict: {plz} is already in {plz2gemeinde[plz]} when trying to add to {gemeindename}")
                plz2gemeinde[plz] = gemeindename
    with open('plz/plz2gemeinde.json', 'w') as json_file:
        json.dump(plz2gemeinde, json_file)
