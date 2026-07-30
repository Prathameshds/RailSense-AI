import json
import csv
from typing import Any, Dict
from .queries import RailQueries

class RailExporter:
    def __init__(self, queries: RailQueries):
        self.queries = queries

    def export_schedule_json(self, train_number: str, filename: str):
        data = self.queries.get_train_schedule(train_number)
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

    def export_schedule_csv(self, train_number: str, filename: str):
        data = self.queries.get_train_schedule(train_number)
        if not data:
            return
        
        route = data.get('route', [])
        if not route:
            return
            
        keys = route[0].keys()
        with open(filename, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(route)

    def export_route_geojson(self, train_number: str, filename: str):
        data = self.queries.get_train_schedule(train_number)
        if not data:
            return
            
        route = data.get('route', [])
        features = []
        
        # Add line string
        coordinates = [[r['longitude'], r['latitude']] for r in route if r['latitude'] and r['longitude']]
        line_feature = {
            "type": "Feature",
            "properties": {"train_number": train_number, "name": data['name']},
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            }
        }
        features.append(line_feature)
        
        # Add station points
        for r in route:
            if r['latitude'] and r['longitude']:
                features.append({
                    "type": "Feature",
                    "properties": {
                        "name": r['station_name'],
                        "code": r['station_code'],
                        "sequence": r['sequence']
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [r['longitude'], r['latitude']]
                    }
                })
        
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        
        with open(filename, 'w') as f:
            json.dump(geojson, f, indent=2)
