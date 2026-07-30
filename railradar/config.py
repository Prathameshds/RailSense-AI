import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    API_KEY = os.getenv("RAILRADAR_API_KEY", "rg_5ca6ce5e0fc24a1d97ca803ad730101c")
    BASE_URL = os.getenv("RAILRADAR_BASE_URL", "https://api.railradar.in/v1")
    DB_PATH = os.getenv("RAILRADAR_DB_PATH", "railradar.db")
    
    # Rate Limiting
    REQUEST_INTERVAL = 6.0  # seconds between requests
    DAILY_LIMIT = 50
    DAILY_BUFFER = 45  # Stop at 45 to be safe
    
    # Logging
    LOG_FILE = "railradar.log"
    LOG_LEVEL = "INFO"
