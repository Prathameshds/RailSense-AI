import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  Wind, 
  Eye, 
  CloudRain, 
  CloudLightning, 
  TriangleAlert, 
  Navigation,
  ArrowUpRight,
  Waves,
  Info,
  ShieldCheck,
  LocateFixed,
  Radio,
  Map as MapIcon,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PanIndiaWeatherIntel, WeatherLocation } from '@/types';

export default function WeatherIntelligence() {
  const [data, setData] = React.useState<PanIndiaWeatherIntel | null>(null);
  const [selectedLocationId, setSelectedLocationId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('/api/weather/intelligence');
      const json = await response.json();
      setData(json);
      if (!selectedLocationId && json.locations.length > 0) {
        setSelectedLocationId(json.locations[0].id);
      }
    } catch (error) {
      console.error('Error fetching weather intel:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 font-medium animate-pulse">Syncing City-Level Weather Intelligence...</p>
        </div>
      </div>
    );
  }

  const filteredLocations = data.locations.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLocation = data.locations.find(l => l.id === selectedLocationId) || data.locations[0];

  const signalColors = {
    PROCEED: "bg-green-500 shadow-green-500/40",
    PROCEED_CAUTION: "bg-amber-400 shadow-amber-400/40",
    CAUTION: "bg-amber-600 shadow-amber-600/40",
    STOP_RESTRICTED: "bg-orange-600 shadow-orange-600/40",
    STOP: "bg-red-600 shadow-red-600/40"
  };

  const severityStyles = {
    CRITICAL: "bg-red-500/10 text-red-500 border-red-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 px-3 uppercase">
              Live City Network
            </Badge>
            <Badge variant="outline" className="bg-purple-500/5 text-purple-500 border-purple-500/20 px-3 uppercase">
              {data.locations.length} Cities Monitored
            </Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Weather <span className="text-blue-600">Intelligence</span></h1>
          <p className="text-gray-500 font-medium">City-specific environmental risk & signal decision support.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
             <input 
                type="text"
                placeholder="Search city or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-64 shadow-sm"
             />
             <LocateFixed className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button 
            onClick={() => fetchData()}
            className="p-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Radio className={cn("h-5 w-5 text-blue-600", loading ? "animate-pulse" : "")} />
          </button>
        </div>
      </div>

      {/* City Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredLocations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelectedLocationId(loc.id)}
            className={cn(
              "px-4 py-3 rounded-2xl text-left transition-all relative overflow-hidden group",
              selectedLocationId === loc.id 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" 
                : "bg-white text-gray-600 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50"
            )}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">
                {loc.name}
              </span>
              <span className="text-[10px] font-bold truncate opacity-40">
                {loc.district}
              </span>
            </div>
            {selectedLocationId === loc.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLocationId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          {/* Main City Display */}
          <div className="xl:col-span-2 space-y-8">
            <Card className="p-8 border-none bg-white shadow-2xl relative overflow-hidden group border border-gray-100">
              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {/* Weather Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <LocateFixed className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{selectedLocation.name}, {selectedLocation.district}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl font-black text-gray-900">{selectedLocation.weather.temp}°</span>
                      <span className="text-2xl text-gray-400 font-medium">Feels like {selectedLocation.weather.feelsLike}°</span>
                    </div>
                    <p className="text-xl text-blue-600 font-bold mt-2">{selectedLocation.weather.condition}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Humidity</p>
                      <p className="text-lg font-bold text-gray-900">{selectedLocation.weather.humidity}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rainfall</p>
                      <p className="text-lg font-bold text-gray-900">{selectedLocation.weather.rainfall}mm <span className="text-xs font-normal text-gray-400 ml-1">({selectedLocation.weather.rainProb}%)</span></p>
                    </div>
                  </div>
                </div>

                {/* Signal Indicator */}
                <div className="w-full md:w-80 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col items-center justify-center text-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                  
                  <div className={cn(
                    "h-24 w-24 rounded-full mb-6 relative",
                    signalColors[selectedLocation.signalStatus]
                  )}>
                     <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-125" />
                     {selectedLocation.signalStatus !== 'PROCEED' && (
                        <motion.div 
                           animate={{ opacity: [0.5, 1, 0.5] }}
                           transition={{ repeat: Infinity, duration: 1.5 }}
                           className="absolute inset-0 rounded-full bg-inherit blur-xl opacity-50"
                        />
                     )}
                  </div>

                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">SIGNAL INDICATION</p>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                    {selectedLocation.signalStatus.replace('_', ' ')}
                  </h3>
                  
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10 w-full">
                    <p className="text-xs font-bold leading-relaxed text-blue-100">
                      {selectedLocation.safetyRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* City Specific Risks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight text-gray-900">City <span className="text-blue-600">Risk Profile</span></h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-bold uppercase">
                  {selectedLocation.name} Hub
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedLocation.risks.length > 0 ? (
                  selectedLocation.risks.map((risk) => (
                    <Card key={risk.id} className="p-6 border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={cn("px-3 py-1 font-bold", severityStyles[risk.severity])}>
                          {risk.severity}
                        </Badge>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">PROB: {risk.probability}%</span>
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        {risk.type === 'FLOOD' && <Waves className="h-4 w-4 text-blue-500" />}
                        {risk.type === 'VISIBILITY' && <Eye className="h-4 w-4 text-amber-500" />}
                        {risk.type === 'WIND' && <Wind className="h-4 w-4 text-gray-400" />}
                        {risk.type === 'EXPANSION' && <Zap className="h-4 w-4 text-orange-500" />}
                        {risk.type} RISK DETECTED
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-6">{risk.reason}</p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-50 bg-gray-50/50 -mx-6 px-6 -mb-6 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recommended Action</p>
                        </div>
                        <p className="text-xs font-bold text-gray-700">{risk.action}</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 border-dashed border-gray-200 col-span-2 flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="h-10 w-10 text-green-500 mb-4 opacity-20" />
                    <p className="text-sm font-bold text-gray-900">No active risks detected</p>
                    <p className="text-xs text-gray-400 mt-1">Environmental parameters are within safety thresholds for this location.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Alerts & Global Context */}
          <div className="space-y-8">
            <Card className="p-8 border-none bg-blue-600 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Radio className="h-5 w-5 text-blue-200" />
                Regional Alerts
              </h3>
              <div className="space-y-4">
                {data.globalAlerts.length > 0 ? (
                  data.globalAlerts.map(alert => (
                    <div key={alert.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">{alert.priority}</span>
                        <span className="text-[10px] font-bold text-blue-200">{alert.time}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs text-blue-50/70 mb-3">{alert.description}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-100 bg-blue-700/50 p-2 rounded-lg">
                        <TriangleAlert className="h-3 w-3" />
                        {alert.location}
                      </div>
                    </div>
                  ))
                ) : (
                   <p className="text-xs text-blue-200 italic">No active network-wide alerts.</p>
                )}
              </div>
            </Card>

            {/* Hub Details */}
            <Card className="p-6 border-gray-100 space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Local Sensing Node</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Wind className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{selectedLocation.weather.windSpeed} km/h</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Wind Speed</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-300" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{selectedLocation.weather.visibility}m</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Visibility</p>
                    </div>
                  </div>
                  <Badge className="bg-green-50 text-green-600 border-green-100 text-[10px] font-black">ACTIVE</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Signal Health</p>
                <div className="flex items-end justify-between h-12 px-2">
                  {[40, 65, 30, 85, 45, 90, 70, 55, 80, 40].map((h, i) => (
                    <div key={i} className="w-1.5 bg-blue-100 rounded-t-full transition-all hover:bg-blue-500" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </Card>

            {/* AI Insight */}
            <Card className="p-6 border-none bg-gray-900 text-white overflow-hidden relative">
              <div className="absolute bottom-0 right-0 p-4 opacity-10">
                <CloudLightning className="h-12 w-12" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-100">Local Safety Forecast</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Analyzing historical environmental patterns for {selectedLocation.name}. System suggests 95% confidence in current signal state.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
