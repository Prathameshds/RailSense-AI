import json
from typing import List, Dict, Any, Optional
from .database import Database

class RailQueries:
    def __init__(self, db: Database):
        self.db = db

    def get_train_schedule(self, train_number: str) -> Dict[str, Any]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM trains WHERE number = ?", (train_number,))
            train = cursor.fetchone()
            if not train:
                return {}
            
            cursor.execute("SELECT * FROM routes WHERE train_number = ? ORDER BY sequence", (train_number,))
            route = [dict(row) for row in cursor.fetchall()]
            
            result = dict(train)
            result['route'] = route
            result['run_days'] = json.loads(result['run_days']) if result['run_days'] else []
            return result

    def get_live_status(self, train_number: str) -> Optional[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM live_status 
                WHERE train_number = ? 
                ORDER BY fetched_at DESC LIMIT 1
            ''', (train_number,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def search_trains(self, query: str) -> List[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM train_lookup 
                WHERE number LIKE ? OR name LIKE ? 
                LIMIT 20
            ''', (f"%{query}%", f"%{query}%"))
            return [dict(row) for row in cursor.fetchall()]

    def get_trains_by_status(self, status: str) -> List[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT t.*, l.status as current_status, l.delay_minutes 
                FROM trains t
                JOIN live_status l ON t.number = l.train_number
                WHERE l.status = ?
                GROUP BY t.number
                HAVING l.fetched_at = MAX(l.fetched_at)
            ''', (status,))
            return [dict(row) for row in cursor.fetchall()]
