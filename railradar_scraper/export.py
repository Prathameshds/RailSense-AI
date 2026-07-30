import json
import csv
from typing import Dict, Any
from .queries import Queries

class Exporter:
    def __init__(self, queries: Queries):
        self.queries = queries

    def export_active_geojson(self, filename: str):
        trains = self.queries.get_active_trains()
        features = []
        for t in trains:
            features.append({
                "type": "Feature",
                "properties": {
                    "number": t['train_number'],
                    "name": t['name'],
                    "delay": t['delay_minutes'],
                    "last_station": t['last_station'],
                    "next_station": t['next_station']
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [t['longitude'], t['latitude']]
                }
            })
        
        geojson = {"type": "FeatureCollection", "features": features}
        with open(filename, 'w') as f:
            json.dump(geojson, f, indent=2)

    def export_route_geojson(self, number: str, filename: str):
        data = self.queries.get_train_schedule(number)
        if not data: return
        
        route = data['route']
        coordinates = [[r['longitude'], r['latitude']] for r in route if r['latitude']]
        
        geojson = {
            "type": "Feature",
            "properties": {"number": number, "name": data['name']},
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            }
        }
        
        with open(filename, 'w') as f:
            json.dump(geojson, f, indent=2)
