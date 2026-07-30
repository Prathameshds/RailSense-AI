/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Layers,
  Search,
  Filter,
  Train,
  AlertCircle,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapComponent from '@/components/dashboard/MapComponent';
import { cn } from '@/lib/utils';

export default function LiveMap() {
  const [stats, setStats] = React.useState({
    total: 0,
    delayed: 0,
    running: 0
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/rail-radar');
        const data = await res.json();
        if (data.trains) {
          const total = data.totalActive || data.trains.length;
          const delayed = data.trains.filter((t: any) => t.status === 'DELAYED').length;
          const running = data.trains.length - delayed;
          setStats({ total, delayed, running });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Live Railway Map</h1>
          <p className="text-gray-500 mt-1">Real-time GIS tracking powered by RailRadar AI core (OpenSource).</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search trains, stations..." 
              className="bg-white border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
            />
          </div>
          <Button variant="outline" size="icon" className="bg-white">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="h-[75vh] min-h-[600px] border-gray-200/60 shadow-xl overflow-hidden relative rounded-3xl">
        <MapComponent />

        {/* Floating Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-[1000]">
          <Button variant="secondary" size="icon" className="shadow-2xl bg-gray-900 text-white h-10 w-10 border border-white/10 hover:bg-black">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="shadow-2xl bg-gray-900 text-white h-10 w-10 border border-white/10 hover:bg-black">
            <Layers className="h-4 w-4" />
          </Button>
        </div>


      </Card>

      {/* System Status Section - Moved Below Map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        {[
          { label: 'Active Trains (Express)', color: 'bg-blue-500', count: stats.total.toString(), icon: Train },
          { label: 'On Schedule', color: 'bg-green-500', count: stats.running.toString(), icon: Activity },
          { label: 'Delayed / Warning', color: 'bg-amber-500', count: stats.delayed.toString(), icon: AlertCircle },
          { label: 'Infrastructure Check', color: 'bg-gray-500', count: 'Stable', icon: ShieldCheck },
        ].map((item, idx) => (
          <Card key={`${item.label}-${idx}`} className="border-gray-200/60 shadow-sm bg-white overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">{item.count}</p>
              </div>
              <div className={cn("p-2 rounded-lg bg-opacity-10", item.color.replace('bg-', 'bg-opacity-10 text-'))}>
                <div className={cn("h-2 w-2 rounded-full mb-1", item.color)} />
              </div>
            </div>
          </Card>
        ))}
        
        {/* Network Metadata */}
        <Card className="col-span-full border-gray-200/60 shadow-sm bg-gray-50/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">System Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Live Radar</span>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Mapping Engine</p>
                <p className="text-xs font-bold text-gray-900">OpenStreetMap</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Radar Latency</p>
                <p className="text-xs font-bold text-green-600">84ms</p>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              Last Global Refresh: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

