import argparse
import sys
from .database import Database
from .api_client import RailRadarClient
from .ingest import DataIngestor
from .queries import RailQueries
from .export import RailExporter

def run_cli():
    parser = argparse.ArgumentParser(description="RailRadar Data Ingestion Pipeline")
    parser.add_argument("--init-db", action="store_true", help="Initialize the database")
    parser.add_argument("--ingest-lookup", action="store_true", help="Fetch train lookup list")
    parser.add_argument("--ingest-details", type=int, metavar="LIMIT", help="Ingest static details for N trains")
    parser.add_argument("--live-poll", nargs="+", metavar="NUMBER", help="Poll live status for specific trains")
    parser.add_argument("--search", type=str, metavar="QUERY", help="Search for trains by number or name")
    parser.add_argument("--export-schedule", nargs=2, metavar=("NUMBER", "FILE"), help="Export train schedule to JSON")
    parser.add_argument("--export-geojson", nargs=2, metavar=("NUMBER", "FILE"), help="Export train route to GeoJSON")

    args = parser.parse_args()
    
    db = Database()
    client = RailRadarClient(db)
    ingestor = DataIngestor(db, client)
    queries = RailQueries(db)
    exporter = RailExporter(queries)

    if args.init_db:
        db.init_db()
        print("Database initialized.")

    if args.ingest_lookup:
        ingestor.initialize_lookup()

    if args.ingest_details:
        ingestor.ingest_static_details(args.ingest_details)

    if args.live_poll:
        ingestor.poll_live_status(args.live_poll)

    if args.search:
        results = queries.search_trains(args.search)
        for r in results:
            print(f"{r['number']}: {r['name']}")

    if args.export_schedule:
        num, filename = args.export_schedule
        exporter.export_schedule_json(num, filename)
        print(f"Exported schedule to {filename}")

    if args.export_geojson:
        num, filename = args.export_geojson
        exporter.export_route_geojson(num, filename)
        print(f"Exported GeoJSON to {filename}")

    if not any(vars(args).values()):
        parser.print_help()

if __name__ == "__main__":
    run_cli()
