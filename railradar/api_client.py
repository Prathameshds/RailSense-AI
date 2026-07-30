import requests
import time
import logging
from typing import Dict, Any, Optional, List
from .config import Config
from .database import Database

class RailRadarClient:
    def __init__(self, db: Database):
        self.db = db
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {Config.API_KEY}",
            "Content-Type": "application/json"
        })
        self.last_request_time = 0

    def _wait_for_rate_limit(self):
        elapsed = time.time() - self.last_request_time
        if elapsed < Config.REQUEST_INTERVAL:
            time.sleep(Config.REQUEST_INTERVAL - elapsed)

    def _make_request(self, method: str, endpoint: str, **kwargs) -> Optional[Dict[str, Any]]:
        # Check daily limit
        count = self.db.get_daily_request_count()
        if count >= Config.DAILY_BUFFER:
            logging.warning(f"Daily request limit reached ({count}/{Config.DAILY_LIMIT}). Stopping.")
            return None

        self._wait_for_rate_limit()
        
        url = f"{Config.BASE_URL}{endpoint}"
        try:
            response = self.session.request(method, url, timeout=10, **kwargs)
            self.last_request_time = time.time()
            self.db.log_request(endpoint)

            if response.status_code == 429:
                logging.error("Rate limit exceeded (429). Backing off.")
                time.sleep(60)
                return self._make_request(method, endpoint, **kwargs)

            response.raise_for_status()
            return response.json()
        except Exception as e:
            logging.error(f"Request failed to {url}: {str(e)}")
            return None

    def get_train_lookup(self) -> Dict[str, str]:
        data = self._make_request("GET", "/lookup/trains")
        return data if data else {}

    def get_train_details(self, train_number: str) -> Optional[Dict[str, Any]]:
        return self._make_request("GET", f"/trains/{train_number}")

    def get_live_status(self, train_number: str) -> Optional[Dict[str, Any]]:
        return self._make_request("GET", f"/trains/{train_number}/live")

    def get_route_geojson(self, train_number: str) -> Optional[Dict[str, Any]]:
        return self._make_request("GET", f"/trains/{train_number}/route", params={"format": "geojson", "stops": "true"})

    def get_station_board(self, station_code: str) -> List[Dict[str, Any]]:
        data = self._make_request("GET", f"/stations/{station_code}/trains")
        return data.get("trains", []) if data else []

    def get_trains_between(self, from_code: str, to_code: str) -> List[Dict[str, Any]]:
        data = self._make_request("GET", f"/trains/between/{from_code}/{to_code}")
        return data.get("trains", []) if data else []
