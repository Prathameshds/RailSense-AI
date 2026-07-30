import json
from typing import List, Dict, Any, Optional
from .database import Database

class Queries:
    def __init__(self, db: Database):
        self.db = db

    def get_active_trains(self) -> List[Dict[str, Any]]:
        """Returns latest positions of all live trains"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT p.*, l.name
                FROM live_positions p
                JOIN train_lookup l ON p.train_number = l.number
                WHERE p.fetched_at = (SELECT MAX(fetched_at) FROM live_positions)
            ''')
            return [dict(row) for row in cursor.fetchall()]

    def get_train_schedule(self, number: str) -> Optional[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM trains WHERE number = ?", (number,))
            train = cursor.fetchone()
            if not train: return None
            
            cursor.execute("SELECT * FROM routes WHERE train_number = ? ORDER BY sequence", (number,))
            route = [dict(row) for row in cursor.fetchall()]
            
            res = dict(train)
            res['route'] = route
            res['run_days'] = json.loads(res['run_days'])
            return res

    def get_live_status(self, number: str) -> Optional[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM live_status_snapshots 
                WHERE train_number = ? 
                ORDER BY fetched_at DESC LIMIT 1
            ''', (number,))
            row = cursor.fetchone()
            if not row: return None
            
            res = dict(row)
            res['per_stop_data'] = json.loads(res['per_stop_data'])
            return res

    def search_station(self, query: str) -> List[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM stations 
                WHERE code LIKE ? OR name LIKE ? 
                LIMIT 10
            ''', (f"%{query}%", f"%{query}%"))
            return [dict(row) for row in cursor.fetchall()]
