/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup,
  Polyline,
  useMap,
  GeoJSON
} from 'react-leaflet';
import L from 'leaflet';
import { TrainLocation, STATION_COORDINATES } from '@/mapData';
import { TrainStatus, WeatherLocation, PanIndiaWeatherIntel } from '@/types';
import { Train, AlertCircle, MapPin, Gauge, Clock, Navigation, Locate, Cloud, CloudRain, Sun, Wind, CloudLightning, ShieldCheck, Waves, Zap, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderToStaticMarkup } from 'react-dom/server';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

// Custom Marker for Stations in the route
const createStationMarker = (name: string) => {
  return L.divIcon({
    html: renderToStaticMarkup(
      <div className="flex flex-col items-center group">
        <div className="w-2 h-2 bg-white border-2 border-blue-500 rounded-full shadow-md group-hover:scale-125 transition-transform" />
        <div className="mt-1 px-1.5 py-0.5 bg-white/95 backdrop-blur-md rounded-md border border-gray-200 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-[8px] font-black text-gray-900 whitespace-nowrap uppercase tracking-tighter">{name}</p>
        </div>
      </div>
    ),
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

// Train type mapping based on RailRadar type codes
const getTrainTypeInfo = (typeCode: number) => {
  switch (typeCode) {
    case 5: return { label: 'Shatabdi/Rajdhani', color: '#3B82F6' }; // Blue
    case 8: return { label: 'Vande Bharat', color: '#F59E0B' }; // Orange/Yellow
    case 6: return { label: 'Local/EMU', color: '#10B981' }; // Green
    case 2: return { label: 'Express', color: '#8B5CF6' }; // Purple
    default: return { label: 'Train', color: '#6B7280' }; // Gray
  }
};

// Custom Marker Icons using Rotated Arrows
const createTrainIcon = (train: TrainLocation) => {
  const { color } = getTrainTypeInfo(train.typeCode);
  const isDelayed = train.status === TrainStatus.DELAYED;
  const bearing = train.bearing || 0;

  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex flex-col items-center">
      {/* Directional Arrow */}
      <div 
        style={{ transform: `rotate(${bearing}deg)` }}
        className="transition-transform duration-500"
      >
        <div className={cn(
          "relative flex items-center justify-center p-1 rounded-full border-2 border-white shadow-lg",
          isDelayed ? "bg-red-500" : "bg-blue-600"
        )} style={{ backgroundColor: isDelayed ? '#EF4444' : color }}>
          <Navigation className="text-white w-3 h-3 fill-white" />
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-1 bg-gray-900/90 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20 text-[8px] font-bold text-white whitespace-nowrap shadow-xl">
        {train.number}
      </div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createWeatherIcon = (location: WeatherLocation) => {
  const signalColors = {
    PROCEED: "bg-green-500 shadow-green-500/40",
    PROCEED_CAUTION: "bg-amber-400 shadow-amber-400/40",
    CAUTION: "bg-amber-600 shadow-amber-600/40",
    STOP_RESTRICTED: "bg-orange-600 shadow-orange-600/40",
    STOP: "bg-red-600 shadow-red-600/40"
  };

  const iconMarkup = renderToStaticMarkup(
    <div className="flex flex-col items-center group">
      <div className={cn(
        "h-4 w-4 rounded-full border-2 border-white shadow-lg relative",
        signalColors[location.signalStatus]
      )}>
        <div className="absolute inset-0 rounded-full animate-ping bg-inherit opacity-20" />
      </div>
      <div className="mt-1 px-1.5 py-0.5 bg-gray-900/90 backdrop-blur-md rounded border border-white/10 shadow-xl hidden group-hover:block">
        <p className="text-[8px] font-black text-white whitespace-nowrap uppercase tracking-widest">{location.name}</p>
      </div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const stationIcon = L.divIcon({
  html: `
    <div class="bg-white/20 p-1 rounded-full border border-white/50 backdrop-blur-sm">
      <div class="h-2 w-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
    </div>
  `,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function MapComponent() {
  const [trains, setTrains] = React.useState<TrainLocation[]>([]);
  const [weatherData, setWeatherData] = React.useState<WeatherLocation[]>([]);
  const [showWeather, setShowWeather] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTrain, setSelectedTrain] = React.useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = React.useState<any>(null);

  // Helper to auto-fit bounds when route changes
  const FitBounds = ({ data }: { data: any }) => {
    const map = useMap();
    React.useEffect(() => {
      if (data && data.features && data.features.length > 0) {
        try {
          const geoJsonLayer = L.geoJSON(data);
          map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50], maxZoom: 12 });
        } catch (e) {
          console.error('FitBounds error:', e);
        }
      }
    }, [data, map]);
    return null;
  };

  const fetchRoute = async (trainNumber: string) => {
    setSelectedRoute(null); // Clear previous route
    try {
      const response = await fetch(`/api/rail-radar/route/${trainNumber}`);
      if (!response.ok) return;
      const data = await response.json();
      // Basic GeoJSON validation
      if (data && data.type) {
        setSelectedRoute(data);
      }
    } catch (err) {
      console.error('Failed to fetch route:', err);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('/api/rail-radar');
      if (!response.ok) throw new Error('API Unavailable');
      const data = await response.json();
      
      if (!data || !Array.isArray(data.trains)) {
        throw new Error('Invalid Data Structure from Server');
      }
      
      const mappedTrains = data.trains.map((t: any) => {
        const trainNum = String(t.number || t.id || 'Unknown');
        const trainName = typeof t.name === 'string' ? t.name : `Train ${trainNum}`;
        const latitude = parseFloat(t.lat);
        const longitude = parseFloat(t.lng);

        if (isNaN(latitude) || isNaN(longitude)) return null;

        return {
          id: trainNum,
          name: trainName,
          number: trainNum,
          lat: latitude,
          lng: longitude,
          speed: Number(t.speed) || 0,
          bearing: Number(t.bearing) || 0,
          typeCode: Number(t.typeCode) || 0,
          delay: Number(t.delay) || 0,
          lastStation: t.lastStation || 'Unknown',
          nextStation: t.nextStation || 'Unknown',
          distFromLast: Number(t.distFromLast) || 0,
          distToNext: Number(t.distToNext) || 0,
          status: t.status === 'DELAYED' ? TrainStatus.DELAYED : TrainStatus.ON_TIME,
          lastUpdated: new Date().toISOString(),
          route: [], 
          progress: 0
        };
      }).filter(Boolean) as TrainLocation[];
      
      setTrains(mappedTrains);
      
      // Fetch Weather Data too
      const weatherRes = await fetch('/api/weather/intelligence');
      if (weatherRes.ok) {
        const wData: PanIndiaWeatherIntel = await weatherRes.json();
        setWeatherData(wData.locations);
      }

      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.warn('Real-time fetch failed:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  // Initial fetch
  React.useEffect(() => {
    fetchRealTimeData();
    const pollInterval = setInterval(fetchRealTimeData, 30000); // Poll every 30s
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden relative border border-gray-200">
      {loading && (
        <div className="absolute inset-0 z-[2000] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4">
             <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Syncing Radar Data...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1500] pointer-events-none">
          <div className="bg-orange-500/90 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-xl flex items-center gap-2 border border-white/20">
            <AlertCircle className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
          </div>
        </div>
      )}
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Weather Layer Toggle Control */}
        <div className="absolute top-24 right-6 z-[1000] flex flex-col gap-2">
           <button 
            onClick={() => setShowWeather(!showWeather)}
            className={cn(
              "p-3 rounded-xl shadow-2xl border transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest",
              showWeather 
                ? "bg-blue-600 text-white border-blue-500" 
                : "bg-gray-900 text-gray-400 border-white/10 hover:text-white"
            )}
           >
             <Cloud className="h-4 w-4" />
             {showWeather ? "Hide Weather" : "Show Weather"}
           </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl space-y-4 pointer-events-auto min-w-[160px]">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Train Types</p>
            <div className="space-y-2">
              {[5, 8, 2, 6].map((code, idx) => {
                const info = getTrainTypeInfo(code);
                return (
                  <div key={`legend-${code}-${idx}`} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                    <span className="text-[9px] font-bold text-white/80 uppercase tracking-tighter">{info.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {showWeather && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Safety Signals</p>
              {[
                { label: 'Proceed', color: 'bg-green-500' },
                { label: 'Caution', color: 'bg-amber-600' },
                { label: 'Stop Restricted', color: 'bg-orange-600' },
                { label: 'Stop / Danger', color: 'bg-red-600' },
              ].map((sig, idx) => (
                <div key={`sig-legend-${idx}`} className="flex items-center gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full", sig.color)} />
                  <span className="text-[9px] font-bold text-white/80 uppercase tracking-tighter">{sig.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Stations */}
        {Object.values(STATION_COORDINATES).map((station, idx) => (
          <Marker 
            key={`station-${station.name}-${idx}`} 
            position={[station.lat, station.lng]}
            icon={stationIcon}
          >
            <Popup>
              <div className="text-xs font-bold">{station.name}</div>
            </Popup>
          </Marker>
        ))}

        {/* City-Level Weather Overlays */}
        {showWeather && weatherData.map((loc) => (
          <Marker
            key={`weather-${loc.id}`}
            position={[loc.lat, loc.lng]}
            icon={createWeatherIcon(loc)}
          >
            <Popup>
              <div className="p-4 min-w-[260px] bg-white rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Locate className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{loc.district}</span>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0",
                    loc.signalStatus === 'PROCEED' ? "border-green-500 text-green-600 bg-green-50" : "border-amber-500 text-amber-600 bg-amber-50"
                  )}>
                    {loc.signalStatus.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-2xl font-black text-gray-900">{loc.name}</h4>
                    <p className="text-xs font-bold text-blue-600">{loc.weather.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-gray-900">{loc.weather.temp}°</p>
                    <p className="text-[10px] font-bold text-gray-400">FEELS LIKE {loc.weather.feelsLike}°</p>
                  </div>
                </div>

                {loc.risks.length > 0 ? (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Active Risks</p>
                    {loc.risks.map(risk => (
                      <div key={risk.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          {risk.type === 'FLOOD' && <Waves className="h-3 w-3 text-blue-500" />}
                          {risk.type === 'WIND' && <Wind className="h-3 w-3 text-gray-400" />}
                          {risk.type === 'EXPANSION' && <Zap className="h-3 w-3 text-orange-500" />}
                          {risk.type === 'ELECTRICAL' && <CloudLightning className="h-3 w-3 text-purple-500" />}
                          <span className="text-[10px] font-bold text-gray-900">{risk.type} RISK ({risk.severity})</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">{risk.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-green-600">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Safe Operations</span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Safety Instruction</p>
                  <p className="text-xs font-bold text-gray-700 leading-snug">{loc.safetyRecommendation}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Real GeoJSON Route for Selected Train */}
        {selectedRoute && selectedRoute.type && (
          <React.Fragment key={`route-container-${selectedTrain || 'none'}`}>
            <FitBounds data={selectedRoute} />
            <GeoJSON
              key={selectedTrain || 'route-layer'}
              data={selectedRoute}
              style={(feature) => ({
                color: trains.find(t => t.number === selectedTrain)?.typeCode === 8 ? '#F59E0B' : '#3B82F6',
                weight: 4,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round'
              })}
              pointToLayer={(feature, latlng) => {
                const name = feature.properties?.name || feature.properties?.station_name || 'Station';
                return L.marker(latlng, { icon: createStationMarker(name) });
              }}
              onEachFeature={(feature, layer) => {
                if (feature.geometry.type === 'Point') {
                  const name = feature.properties?.name || feature.properties?.station_name || 'Station';
                  layer.bindPopup(`<p class="text-[10px] font-bold">${name}</p>`);
                }
              }}
            />
          </React.Fragment>
        )}

        {/* Trains */}
        {trains.map((train, idx) => (
          <Marker 
            key={`train-${train.id}-${idx}`}
            position={[train.lat, train.lng]}
            icon={createTrainIcon(train)}
            eventHandlers={{
              click: () => {
                setSelectedTrain(train.number);
                fetchRoute(train.number);
              }
            }}
          >
            <Popup>
              <div className="p-4 min-w-[280px] bg-white rounded-2xl shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-600 text-white border-none text-[10px] px-2 py-0.5">
                    {getTrainTypeInfo(train.typeCode).label}
                  </Badge>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">#{train.number}</span>
                </div>
                
                <h3 className="font-black text-lg text-gray-900 leading-tight mb-4 tracking-tight">
                  {train.name}
                </h3>

                {/* Station Progress */}
                <div className="relative mb-6 px-1">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-left">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Departed</p>
                      <p className="text-xs font-bold text-gray-900">{train.lastStation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Next Station</p>
                      <p className="text-xs font-bold text-gray-900">{train.nextStation}</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{ width: `${(train.distFromLast / (train.distFromLast + train.distToNext || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                    <span>{train.distFromLast} km ago</span>
                    <span>{train.distToNext} km left</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                      <Gauge className="w-3 h-3" /> Speed
                    </p>
                    <p className="text-xs font-black text-gray-900">{train.speed} <span className="text-[8px] text-gray-400">KM/H</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> Heading
                    </p>
                    <p className="text-xs font-black text-gray-900">{Math.round(train.bearing)}°</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Delay
                    </p>
                    <p className={cn(
                      "text-xs font-black",
                      train.delay > 0 ? "text-red-500" : "text-green-600"
                    )}>
                      {train.delay} <span className="text-[8px] opacity-70">MIN</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      train.status === TrainStatus.DELAYED ? "bg-red-500 animate-pulse" : "bg-green-500"
                    )} />
                    {train.status}
                  </div>
                  <span>Sync: {new Date(train.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
