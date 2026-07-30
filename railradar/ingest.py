import logging
import time
from .database import Database
from .api_client import RailRadarClient
from .config import Config

class DataIngestor:
    def __init__(self, db: Database, client: RailRadarClient):
        self.db = db
        self.client = client
        self._setup_logging()

    def _setup_logging(self):
        logging.basicConfig(
            level=Config.LOG_LEVEL,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(Config.LOG_FILE),
                logging.StreamHandler()
            ]
        )

    def initialize_lookup(self):
        logging.info("Fetching train lookup list...")
        trains = self.client.get_train_lookup()
        if trains:
            self.db.save_train_lookup(trains)
            logging.info(f"Saved {len(trains)} trains to lookup table.")

    def ingest_static_details(self, limit: int = 10):
        logging.info(f"Ingesting static details for up to {limit} trains...")
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            # Find trains in lookup that aren't in trains table yet
            cursor.execute('''
                SELECT number FROM train_lookup 
                WHERE number NOT IN (SELECT number FROM trains)
                LIMIT ?
            ''', (limit,))
            train_numbers = [row['number'] for row in cursor.fetchall()]

        for num in train_numbers:
            logging.info(f"Fetching details for train {num}...")
            details = self.client.get_train_details(num)
            if details:
                route = details.get('route', [])
                self.db.save_train_details(details, route)
                logging.info(f"Saved details for {num}")
            else:
                logging.warning(f"Failed to fetch details for {num}")
            
            if self.db.get_daily_request_count() >= Config.DAILY_BUFFER:
                break

    def poll_live_status(self, train_numbers: list):
        logging.info(f"Polling live status for {len(train_numbers)} trains...")
        for num in train_numbers:
            logging.info(f"Fetching live status for {num}...")
            status = self.client.get_live_status(num)
            if status:
                self.db.save_live_status(num, status)
                logging.info(f"Updated live status for {num}")
            
            if self.db.get_daily_request_count() >= Config.DAILY_BUFFER:
                logging.warning("Daily limit reached during polling.")
                break
