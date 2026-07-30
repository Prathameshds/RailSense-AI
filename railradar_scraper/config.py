import os

class Config:
    BASE_URL = "https://railradar.in/api/v1"
    DB_PATH = "railradar_data.db"
    
    # Polling & Rate Limiting
    POLL_INTERVAL = 60  # seconds between /live-map fetches
    RATE_LIMIT_DELAY = 0.2  # 200ms between detailed requests
    MAX_CONCURRENT_REQUESTS = 5
    
    # Logging
    LOG_FILE = "scraper.log"
    LOG_LEVEL = "INFO"
    
    # User Agent
    USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
