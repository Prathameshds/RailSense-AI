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
            
            # Trains table
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
                    return_train TEXT,
                    coach_position TEXT,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Routes table
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
                    speed_to_next REAL,
                    FOREIGN KEY (train_number) REFERENCES trains (number)
                )
            ''')
            
            # Live Status table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS live_status (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_number TEXT,
                    start_date TEXT,
                    status TEXT,
                    delay_minutes INTEGER,
                    current_station_code TEXT,
                    current_speed_kmh REAL,
                    segment_progress REAL,
                    last_updated_at DATETIME,
                    raw_json TEXT,
                    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Stations table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS stations (
                    code TEXT PRIMARY KEY,
                    name TEXT,
                    latitude REAL,
                    longitude REAL
                )
            ''')
            
            # Train Lookup table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS train_lookup (
                    number TEXT PRIMARY KEY,
                    name TEXT
                )
            ''')
            
            # Request Tracking table (internal)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS request_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    endpoint TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()

    def log_request(self, endpoint: str):
        with self.get_connection() as conn:
            conn.execute("INSERT INTO request_logs (endpoint) VALUES (?)", (endpoint,))
            conn.commit()

    def get_daily_request_count(self) -> int:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM request_logs WHERE date(timestamp) = date('now')")
            return cursor.fetchone()[0]

    def save_train_lookup(self, trains_dict: Dict[str, str]):
        with self.get_connection() as conn:
            data = [(num, name) for num, name in trains_dict.items()]
            conn.executemany("INSERT OR REPLACE INTO train_lookup (number, name) VALUES (?, ?)", data)
            conn.commit()

    def save_train_details(self, train_data: Dict[str, Any], route_data: List[Dict[str, Any]]):
        with self.get_connection() as conn:
            # Save train
            conn.execute('''
                INSERT OR REPLACE INTO trains (
                    number, name, type, category, source_code, source_name, 
                    dest_code, dest_name, run_days, distance, duration, 
                    avg_speed, max_speed, total_halts, return_train, coach_position, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                train_data['number'], train_data['name'], train_data.get('type'), 
                train_data.get('category'), train_data.get('source_code'), 
                train_data.get('source_name'), train_data.get('dest_code'), 
                train_data.get('dest_name'), json.dumps(train_data.get('run_days', [])),
                train_data.get('distance'), train_data.get('duration'),
                train_data.get('avg_speed'), train_data.get('max_speed'),
                train_data.get('total_halts'), train_data.get('return_train'),
                train_data.get('coach_position'), datetime.now()
            ))
            
            # Clear old route
            conn.execute("DELETE FROM routes WHERE train_number = ?", (train_data['number'],))
            
            # Save route segments
            route_rows = []
            for r in route_data:
                route_rows.append((
                    train_data['number'], r.get('sequence'), r.get('station_code'),
                    r.get('station_name'), r.get('latitude'), r.get('longitude'),
                    r.get('scheduled_arrival'), r.get('scheduled_departure'),
                    r.get('arrival_day'), r.get('departure_day'),
                    r.get('distance_from_source'), r.get('is_halt'),
                    r.get('platform'), r.get('speed_to_next')
                ))
            
            conn.executemany('''
                INSERT INTO routes (
                    train_number, sequence, station_code, station_name, 
                    latitude, longitude, scheduled_arrival, scheduled_departure, 
                    arrival_day, departure_day, distance_from_source, is_halt, 
                    platform, speed_to_next
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', route_rows)
            
            conn.commit()

    def save_live_status(self, train_number: str, status_data: Dict[str, Any]):
        with self.get_connection() as conn:
            conn.execute('''
                INSERT INTO live_status (
                    train_number, start_date, status, delay_minutes, 
                    current_station_code, current_speed_kmh, segment_progress, 
                    last_updated_at, raw_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                train_number, status_data.get('start_date'), status_data.get('status'),
                status_data.get('delay_minutes'), status_data.get('current_station_code'),
                status_data.get('current_speed_kmh'), status_data.get('segment_progress'),
                status_data.get('last_updated_at'), json.dumps(status_data)
            ))
            conn.commit()
