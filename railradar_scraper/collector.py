import asyncio
import logging
import time
from datetime import datetime
from .config import Config
from .database import Database
from .api_client import RailRadarAPIClient

class Collector:
    def __init__(self, db: Database):
        self.db = db
        self._setup_logging()

    def _setup_logging(self):
        logging.basicConfig(
            level=Config.LOG_LEVEL,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(Config.LOG_FILE),
                logging.StreamHandler()
            ]
        )

    async def collect_live_map(self, client: RailRadarAPIClient):
        """Continuously polls the live map endpoint"""
        logging.info("Starting live map collection loop...")
        while True:
            start_time = time.time()
            positions = await client.get_live_map()
            if positions:
                self.db.save_live_positions(positions)
                logging.info(f"Saved {len(positions)} train positions.")
            
            # Wait for next interval
            elapsed = time.time() - start_time
            wait_time = max(0, Config.POLL_INTERVAL - elapsed)
            await asyncio.sleep(wait_time)

    async def collect_static_data(self, client: RailRadarAPIClient):
        """One-time collection of static train details"""
        logging.info("Starting static data collection...")
        lookup = await client.get_train_lookup()
        if lookup:
            self.db.save_lookup(lookup)
            logging.info(f"Updated lookup table with {len(lookup)} trains.")

        # Ingest missing details
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT number FROM train_lookup WHERE number NOT IN (SELECT number FROM trains)")
            missing = [row['number'] for row in cursor.fetchall()]

        logging.info(f"Found {len(missing)} trains needing details.")
        for i, num in enumerate(missing):
            details = await client.get_train_details(num)
            if details:
                self.db.save_train_details(details)
                logging.info(f"[{i+1}/{len(missing)}] Saved details for {num}")
            
            await asyncio.sleep(Config.RATE_LIMIT_DELAY)

    async def collect_detailed_snapshots(self, client: RailRadarAPIClient):
        """Fetches detailed live status for active trains"""
        while True:
            # Get currently active trains from latest fetch
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT DISTINCT train_number 
                    FROM live_positions 
                    WHERE fetched_at > datetime('now', '-5 minutes')
                ''')
                active_trains = [row['train_number'] for row in cursor.fetchall()]
            
            logging.info(f"Fetching detailed status for {len(active_trains)} active trains.")
            for num in active_trains:
                status = await client.get_live_status(num)
                if status:
                    self.db.save_live_snapshot(num, status)
                await asyncio.sleep(Config.RATE_LIMIT_DELAY)
            
            await asyncio.sleep(300) # Every 5 minutes
