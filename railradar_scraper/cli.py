import argparse
import asyncio
import sys
from .database import Database
from .api_client import RailRadarAPIClient
from .collector import Collector
from .queries import Queries
from .export import Exporter

async def async_main():
    parser = argparse.ArgumentParser(description="RailRadar Scraper CLI")
    parser.add_argument("--collect-live", action="store_true", help="Start live map collection loop")
    parser.add_argument("--collect-static", action="store_true", help="Run one-time static data collection")
    parser.add_argument("--collect-detailed", action="store_true", help="Start detailed status polling")
    parser.add_argument("--export-active", type=str, metavar="FILE", help="Export active trains to GeoJSON")
    parser.add_argument("--export-route", nargs=2, metavar=("NUM", "FILE"), help="Export train route to GeoJSON")
    parser.add_argument("--search", type=str, help="Search for a train/station")

    args = parser.parse_args()
    
    db = Database()
    queries = Queries(db)
    exporter = Exporter(queries)
    collector = Collector(db)

    if args.collect_static:
        async with RailRadarAPIClient() as client:
            await collector.collect_static_data(client)

    if args.collect_live:
        async with RailRadarAPIClient() as client:
            await collector.collect_live_map(client)

    if args.collect_detailed:
        async with RailRadarAPIClient() as client:
            await collector.collect_detailed_snapshots(client)

    if args.export_active:
        exporter.export_active_geojson(args.export_active)
        print(f"Exported active trains to {args.export_active}")

    if args.export_route:
        num, file = args.export_route
        exporter.export_route_geojson(num, file)
        print(f"Exported route for {num} to {file}")

    if not any(vars(args).values()):
        parser.print_help()

def run_cli():
    try:
        asyncio.run(async_main())
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    run_cli()
