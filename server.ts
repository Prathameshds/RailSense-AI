/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import cors from 'cors';
import axios from 'axios';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // Proxy endpoint for RailRadar data
  const RAILRADAR_API_KEY = process.env.RAILRADAR_API_KEY || 'rg_5ca6ce5e0fc24a1d97ca803ad730101c';
  const RR_BASE_URL = "https://api.railradar.in/v1";
  const RR_HEADERS = {
    'Authorization': `Bearer ${RAILRADAR_API_KEY}`,
    'User-Agent': 'RailRadar-Dashboard/1.0'
  };

  app.get('/api/rail-radar', async (req, res) => {
    try {
      // Strategy 1: Internal live-map API (Bulk positions) - Keeping as fallback/bulk discovery
      try {
        const response = await axios.get('https://railradar.in/api/v1/live-map', {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://railradar.in/railradar'
          }
        });

        let rawTrains = null;
        if (Array.isArray(response.data)) {
          rawTrains = response.data;
        } else if (response.data && typeof response.data === 'object') {
          rawTrains = Object.values(response.data).find(val => Array.isArray(val)) || null;
        }

        if (rawTrains && Array.isArray(rawTrains)) {
          const uniqueTrains = new Map();
          
          rawTrains.forEach(t => {
            if (!Array.isArray(t) || t.length < 9 || t[8] !== 1) return;
            const num = String(t[0]);
            if (!uniqueTrains.has(num)) {
              uniqueTrains.set(num, {
                number: num,
                name: `Train ${num}`,
                typeCode: t[1], // 2=Exp, 5=Shatabdi, 6=EMU, 8=Spl
                lat: parseFloat(t[3]),
                lng: parseFloat(t[4]),
                bearing: parseFloat(t[5]) || 0,
                delay: parseInt(t[6], 10) || 0,
                lastStation: t[9] || 'Unknown',
                distFromLast: t[10] || 0,
                nextStation: t[11] || 'Unknown',
                distToNext: t[12] || 0,
                speed: Math.floor(Math.random() * 40) + 60,
                status: t[6] > 15 ? 'DELAYED' : (t[6] > 0 ? 'RUNNING' : 'ON_TIME'),
                driver: ['A. Sharma', 'R. Patel', 'V. Kumar', 'S. Gupta'][Math.floor(Math.random() * 4)],
                capacity: 1200,
                load: Math.floor(Math.random() * 40) + 50, // 50-90%
                lastMaintenance: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
                nextMaintenance: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
                energyLevel: Math.floor(Math.random() * 30) + 70 // 70-100%
              });
            }
          });

          const trainList = Array.from(uniqueTrains.values()).slice(0, 500);
          if (trainList.length > 0) {
            return res.json({ 
              trains: trainList, 
              totalActive: uniqueTrains.size,
              source: 'railradar_live',
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (e: any) {
        console.warn('Live map API failed:', e.message);
      }

      // Fallback: Simulated data
      const simulatedTrains = [
        { number: '12423', name: 'Rajdhani Express', lat: 28.6139, lng: 77.2090, speed: 125, delay: 0, status: 'ON_TIME', bearing: 45, typeCode: 5, driver: 'A. Sharma', capacity: 1200, load: 85, lastMaintenance: '2024-05-15', nextMaintenance: '2024-08-15', energyLevel: 92 },
        { number: '12260', name: 'Duronto Express', lat: 22.5726, lng: 88.3639, speed: 110, delay: 15, status: 'RUNNING', bearing: 180, typeCode: 2, driver: 'R. Patel', capacity: 1000, load: 72, lastMaintenance: '2024-06-02', nextMaintenance: '2024-09-02', energyLevel: 78 },
        { number: '12951', name: 'Mumbai Rajdhani', lat: 19.0760, lng: 72.8777, speed: 130, delay: 5, status: 'ON_TIME', bearing: 270, typeCode: 5, driver: 'V. Kumar', capacity: 1400, load: 92, lastMaintenance: '2024-05-28', nextMaintenance: '2024-08-28', energyLevel: 88 },
        { number: '22436', name: 'Vande Bharat', lat: 25.3176, lng: 82.9739, speed: 160, delay: 0, status: 'ON_TIME', bearing: 90, typeCode: 8, driver: 'S. Gupta', capacity: 800, load: 98, lastMaintenance: '2024-06-10', nextMaintenance: '2024-09-10', energyLevel: 95 },
      ].map(t => ({
        ...t,
        lat: t.lat + (Math.random() - 0.5) * 5,
        lng: t.lng + (Math.random() - 0.5) * 5
      }));

      res.json({ 
        trains: simulatedTrains, 
        totalActive: simulatedTrains.length,
        source: 'simulated_fallback',
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({ error: 'Data Fetch Failed', message: error.message });
    }
  });

  // Official RailRadar API Endpoints (from user guide)
  app.get('/api/rail-radar/lookup/trains', async (req, res) => {
    try {
      const response = await axios.get(`${RR_BASE_URL}/lookup/trains`, { headers: RR_HEADERS });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.get('/api/rail-radar/lookup/stations', async (req, res) => {
    try {
      const response = await axios.get(`${RR_BASE_URL}/legacy/stations/all-kvs`, { headers: RR_HEADERS });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.get('/api/rail-radar/trains/:tn/live', async (req, res) => {
    try {
      const { tn } = req.params;
      const response = await axios.get(`${RR_BASE_URL}/trains/${tn}/live?includeCoordinates=true`, { headers: RR_HEADERS });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.get('/api/rail-radar/route/:number', async (req, res) => {
    try {
      const trainNumber = req.params.number;
      const response = await axios.get(`${RR_BASE_URL}/trains/${trainNumber}/route?format=geojson&stops=true`, { 
        headers: RR_HEADERS 
      });
      res.json(response.data);
    } catch (error: any) {
      // Fallback to the old strategy if the new one fails (different base URL)
      try {
        const trainNumber = req.params.number;
        const response = await axios.get(`https://railradar.in/api/v1/trains/${trainNumber}/route`, {
          params: { format: 'geojson', stops: 'true' },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://railradar.in/railradar'
          }
        });
        res.json(response.data);
      } catch (e: any) {
        res.status(500).json({ error: 'Failed to fetch route', message: error.message });
      }
    }
  });

  app.get('/api/rail-radar/stations/:code/live', async (req, res) => {
    try {
      const { code } = req.params;
      const response = await axios.get(`${RR_BASE_URL}/stations/${code}/live?hours=4`, { headers: RR_HEADERS });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.get('/api/rail-radar/trains/between/:from/:to', async (req, res) => {
    try {
      const { from, to } = req.params;
      const response = await axios.get(`${RR_BASE_URL}/trains/between/${from}/${to}`, { headers: RR_HEADERS });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  // Pan-India City-Level Weather Intelligence Service
  const getPanIndiaWeatherIntelligence = () => {
    const locations = [
      {
        id: 'mum-01',
        name: 'Mumbai',
        district: 'Mumbai City',
        lat: 19.0760,
        lng: 72.8777,
        weather: {
          temp: 28,
          feelsLike: 32,
          humidity: 92,
          rainfall: 145,
          rainProb: 98,
          windSpeed: 42,
          windDir: 'SW',
          visibility: 600,
          condition: 'Extreme Monsoon Rain',
          icon: 'cloud-rain'
        },
        risks: [
          {
            id: 'risk-m1',
            type: 'FLOOD',
            severity: 'CRITICAL',
            reason: 'Water logging at Kurla-Sion track level.',
            action: 'Suspend Central Line slow services immediately.',
            probability: 99
          }
        ],
        signalStatus: 'STOP_RESTRICTED',
        safetyRecommendation: 'Water above rail head. Stop all non-emergency transit.'
      },
      {
        id: 'del-01',
        name: 'New Delhi',
        district: 'New Delhi',
        lat: 28.6139,
        lng: 77.2090,
        weather: {
          temp: 44,
          feelsLike: 48,
          humidity: 12,
          rainfall: 0,
          rainProb: 0,
          windSpeed: 25,
          windDir: 'W',
          visibility: 3000,
          condition: 'Severe Heatwave',
          icon: 'sun'
        },
        risks: [
          {
            id: 'risk-d1',
            type: 'EXPANSION',
            severity: 'HIGH',
            reason: 'Track temperature exceeds 55°C.',
            action: 'Impose speed restriction of 30km/h on heavy freights.',
            probability: 90
          }
        ],
        signalStatus: 'CAUTION',
        safetyRecommendation: 'Thermal expansion risk. Increase track patrolling.'
      },
      {
        id: 'blr-01',
        name: 'Bengaluru',
        district: 'Bengaluru Urban',
        lat: 12.9716,
        lng: 77.5946,
        weather: {
          temp: 22,
          feelsLike: 22,
          humidity: 65,
          rainfall: 2,
          rainProb: 15,
          windSpeed: 12,
          windDir: 'W',
          visibility: 5000,
          condition: 'Clear Skies',
          icon: 'sun'
        },
        risks: [],
        signalStatus: 'PROCEED',
        safetyRecommendation: 'Safe operating conditions. Proceed as scheduled.'
      },
      {
        id: 'kol-01',
        name: 'Kolkata',
        district: 'Kolkata',
        lat: 22.5726,
        lng: 88.3639,
        weather: {
          temp: 31,
          feelsLike: 39,
          humidity: 85,
          rainfall: 25,
          rainProb: 75,
          windSpeed: 20,
          windDir: 'SE',
          visibility: 1200,
          condition: 'Thundershowers',
          icon: 'cloud-lightning'
        },
        risks: [
          {
            id: 'risk-k1',
            type: 'ELECTRICAL',
            severity: 'MEDIUM',
            reason: 'Lightning activity in Sealdah division.',
            action: 'Monitor OHE voltage fluctuations.',
            probability: 70
          }
        ],
        signalStatus: 'PROCEED_CAUTION',
        safetyRecommendation: 'Lightning risk. Alert maintenance teams.'
      },
      {
        id: 'chn-01',
        name: 'Chennai',
        district: 'Chennai',
        lat: 13.0827,
        lng: 80.2707,
        weather: {
          temp: 34,
          feelsLike: 40,
          humidity: 75,
          rainfall: 5,
          rainProb: 20,
          windSpeed: 58,
          windDir: 'E',
          visibility: 2500,
          condition: 'Gale Winds',
          icon: 'wind'
        },
        risks: [
          {
            id: 'risk-c1',
            type: 'WIND',
            severity: 'HIGH',
            reason: 'High wind speed on coastal lines.',
            action: 'Halt traffic on Pamban Bridge.',
            probability: 88
          }
        ],
        signalStatus: 'CAUTION',
        safetyRecommendation: 'Cross-wind warning for coastal bridges.'
      }
    ];

    const globalAlerts = [
      {
        id: 'ga-1',
        title: 'Monsoon Protocol Active',
        priority: 'HIGH',
        time: '08:00 AM',
        location: 'Mumbai - Konkan Belt',
        description: 'Standard monsoon operating procedures in effect.',
        action: 'Activate emergency pumps',
        affectedTrack: 'Western Corridor'
      }
    ];

    return { locations, globalAlerts, lastUpdated: new Date().toISOString() };
  };

  app.get('/api/weather/intelligence', (req, res) => {
    res.json(getPanIndiaWeatherIntelligence());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/*splat', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
