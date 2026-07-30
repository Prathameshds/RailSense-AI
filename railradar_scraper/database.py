import sqlite3
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from .config import Config

class Database:
    def __init__(self, db_path: str = Config.DB_PATH):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Trains Static Data
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS trains (
                    number TEXT PRIMARY KEY,
                    name TEXT,
                    type TEXT,
                    category TEXT,
                    source_code TEXT,
                    source_name TEXT,
                    dest_code TEXT,
                    dest_name TEXT,
                    run_days TEXT,
                    distance INTEGER,
                    duration TEXT,
                    avg_speed REAL,
                    max_speed REAL,
                    total_halts INTEGER,
                    coach_position TEXT,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Route Data
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS routes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_number TEXT,
                    sequence INTEGER,
                    station_code TEXT,
                    station_name TEXT,
                    latitude REAL,
                    longitude REAL,
                    scheduled_arrival TEXT,
                    scheduled_departure TEXT,
                    arrival_day INTEGER,
                    departure_day INTEGER,
                    distance_from_source REAL,
                    is_halt BOOLEAN,
                    platform TEXT,
                    FOREIGN KEY (train_number) REFERENCES trains (number)
                )
            ''')
            
            # Live Positions (History)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS live_positions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_number TEXT,
                    latitude REAL,
                    longitude REAL,
                    bearing REAL,
                    delay_minutes INTEGER,
                    speed REAL,
                    last_station TEXT,
                    next_station TEXT,
                    distance_from_source REAL,
                    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Detailed Live Status Snapshots
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS live_status_snapshots (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_number TEXT,
                    start_date TEXT,
                    status TEXT,
                    delay INTEGER,
                    current_station TEXT,
                    per_stop_data TEXT,
                    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Stations
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS stations (
                    code TEXT PRIMARY KEY,
                    name TEXT,
                    latitude REAL,
                    longitude REAL
                )
            ''')
            
            # Train Lookup
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS train_lookup (
                    number TEXT PRIMARY KEY,
                    name TEXT
                )
            ''')
            
            conn.commit()

    def save_lookup(self, lookup_dict: Dict[str, str]):
        with self.get_connection() as conn:
            data = [(num, name) for num, name in lookup_dict.items()]
            conn.executemany("INSERT OR REPLACE INTO train_lookup (number, name) VALUES (?, ?)", data)
            conn.commit()

    def save_live_positions(self, positions: List[List[Any]]):
        """Saves data from /live-map endpoint"""
        now = datetime.now()
        data = []
        for p in positions:
            # [num, type, dir, lat, lng, bearing, delay, flag, isLive, lastStat, distSrc, nextStat, distNext]
            if p[8] == 1: # Only save live trains
                data.append((p[0], p[3], p[4], p[5], p[6], 0, p[9], p[11], p[10], now))
        
        with self.get_connection() as conn:
            conn.executemany('''
                INSERT INTO live_positions (
                    train_number, latitude, longitude, bearing, 
                    delay_minutes, speed, last_station, next_station, 
                    distance_from_source, fetched_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', data)
            conn.commit()

    def save_train_details(self, details: Dict[str, Any]):
        with self.get_connection() as conn:
            train = details.get('train', details)
            conn.execute('''
                INSERT OR REPLACE INTO trains (
                    number, name, type, category, source_code, source_name,
                    dest_code, dest_name, run_days, distance, duration,
                    avg_speed, max_speed, total_halts, coach_position, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                train.get('number'), train.get('name'), train.get('type'),
                train.get('category'), train.get('source_code'), train.get('source_name'),
                train.get('dest_code'), train.get('dest_name'), 
                json.dumps(train.get('run_days', [])),
                train.get('distance'), train.get('duration'),
                train.get('avg_speed'), train.get('max_speed'),
                train.get('total_halts'), train.get('coach_position'),
                datetime.now()
            ))
            
            # Save route
            route = details.get('route', [])
            conn.execute("DELETE FROM routes WHERE train_number = ?", (train.get('number'),))
            route_data = []
            for r in route:
                route_data.append((
                    train.get('number'), r.get('sequence'), r.get('station_code'),
                    r.get('station_name'), r.get('latitude'), r.get('longitude'),
                    r.get('scheduled_arrival'), r.get('scheduled_departure'),
                    r.get('arrival_day'), r.get('departure_day'),
                    r.get('distance'), r.get('is_halt'), r.get('platform')
                ))
            
            conn.executemany('''
                INSERT INTO routes (
                    train_number, sequence, station_code, station_name,
                    latitude, longitude, scheduled_arrival, scheduled_departure,
                    arrival_day, departure_day, distance_from_source, is_halt, platform
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', route_data)
            conn.commit()

    def save_live_snapshot(self, train_number: str, status: Dict[str, Any]):
        with self.get_connection() as conn:
            conn.execute('''
                INSERT INTO live_status_snapshots (
                    train_number, start_date, status, delay, 
                    current_station, per_stop_data
                ) VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                train_number, status.get('start_date'), status.get('status'),
                status.get('delay'), status.get('current_station_code'),
                json.dumps(status.get('stops', []))
            ))
            conn.commit()
