import aiohttp
import asyncio
import logging
import time
from typing import Dict, Any, Optional, List
from .config import Config

class RailRadarAPIClient:
    def __init__(self):
        self.base_url = Config.BASE_URL
        self.headers = {
            "User-Agent": Config.USER_AGENT,
            "Referer": "https://railradar.in/railradar"
        }
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(headers=self.headers)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def _request(self, method: str, endpoint: str, **kwargs) -> Optional[Any]:
        if not self.session:
            self.session = aiohttp.ClientSession(headers=self.headers)
        
        url = f"{self.base_url}{endpoint}"
        try:
            async with self.session.request(method, url, **kwargs) as response:
                if response.status == 429:
                    logging.warning("Rate limited. Waiting 10s...")
                    await asyncio.sleep(10)
                    return await self._request(method, endpoint, **kwargs)
                
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            logging.error(f"API Error at {endpoint}: {str(e)}")
            return None

    async def get_live_map(self) -> List[List[Any]]:
        """Returns all active train positions"""
        data = await self._request("GET", "/live-map")
        return data if data else []

    async def get_train_lookup(self) -> Dict[str, str]:
        """Returns number -> name mapping"""
        return await self._request("GET", "/lookup/trains") or {}

    async def get_train_details(self, number: str) -> Optional[Dict[str, Any]]:
        """Static schedule and route"""
        return await self._request("GET", f"/trains/{number}")

    async def get_live_status(self, number: str) -> Optional[Dict[str, Any]]:
        """Detailed live status"""
        return await self._request("GET", f"/trains/{number}/live")

    async def get_route_geojson(self, number: str) -> Optional[Dict[str, Any]]:
        """GeoJSON route"""
        return await self._request("GET", f"/trains/{number}/route", params={"format": "geojson", "stops": "true"})

    async def get_station_board(self, code: str, hours: int = 4) -> List[Dict[str, Any]]:
        """Live station arrivals/departures"""
        data = await self._request("GET", f"/stations/{code}/live", params={"hours": hours})
        return data.get("trains", []) if data else []
