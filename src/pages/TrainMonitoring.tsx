/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Train, 
  Search, 
  Filter, 
  MoreHorizontal, 
  MapPin, 
  Navigation,
  Activity,
  ChevronRight,
  RefreshCw,
  User,
  Users,
  Wrench,
  Signal,
  Eye,
  Bell
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertPriority } from '@/types';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

const priorityColors: Record<AlertPriority, string> = {
  [AlertPriority.LOW]: "bg-green-50 text-green-700 border-green-200",
  [AlertPriority.MEDIUM]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [AlertPriority.HIGH]: "bg-orange-50 text-orange-700 border-orange-200",
  [AlertPriority.CRITICAL]: "bg-red-50 text-red-700 border-red-200",
};

interface TrainData {
  number: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  delay: number;
  status: string;
  lastStation: string;
  nextStation: string;
  driver: string;
  capacity: number;
  load: number;
  lastMaintenance: string;
  nextMaintenance: string;
  energyLevel: number;
}

export default function TrainMonitoring() {
  const [trains, setTrains] = React.useState<TrainData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/rail-radar');
      const data = await res.json();
      if (data.trains) {
        setTrains(data.trains);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAction = (action: string, trainNum: string) => {
    toast.success(`${action} Signal Sent`, {
      description: `${action} command successfully transmitted to Train #${trainNum}.`,
    });
  };

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredTrains = trains.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.number.includes(searchTerm)
  );

  return (
    <TooltipProvider>
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Active Train Monitoring</h1>
          <p className="text-gray-500 mt-1">Real-time telematics and signal status for all en-route trains.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search train ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
          <Button variant="outline" size="sm" className="bg-white h-9 gap-2" onClick={fetchData}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-gray-900 border-none shadow-xl text-white p-6 relative overflow-hidden rounded-3xl">
            <div className="relative z-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80 mb-2">Total On-Track</h3>
               <p className="text-4xl font-black tracking-tighter mb-4">{trains.length.toLocaleString()}</p>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/5">
                  <Activity className="h-3 w-3 text-blue-400" />
                  Live Sync Active
               </div>
            </div>
            <Train className="absolute -right-8 -bottom-8 h-40 w-40 text-white/[0.03] rotate-12" />
         </Card>

         <Card className="p-6 border-gray-100 shadow-sm flex flex-col justify-center rounded-3xl bg-white group hover:shadow-md transition-shadow">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Signal Reliability</h3>
            <div className="flex items-end gap-3 mb-3">
               <p className="text-3xl font-black text-gray-900 tracking-tighter">99.8%</p>
               <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] font-black px-2 py-0.5 rounded-lg mb-1">STABLE</Badge>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '99.8%' }}
                 className="h-full bg-green-500 rounded-full" 
               />
            </div>
         </Card>

         <Card className="p-6 border-gray-100 shadow-sm flex flex-col justify-center rounded-3xl bg-white group hover:shadow-md transition-shadow">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Communication Nodes</h3>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">4,502</p>
                  <div className="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </div>
               </div>
               <div className="h-12 w-px bg-gray-100 mx-2" />
               <div className="space-y-1">
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">14</p>
                  <div className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Offline
                  </div>
               </div>
            </div>
         </Card>
      </div>

      <Card className="border-gray-200/60 shadow-sm overflow-hidden rounded-3xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Train Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Current Position</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Speed</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Delay</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTrains.map((train, idx) => (
                <tr key={`${train.number}-${idx}`} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <Train className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{train.number}</p>
                        <p className="text-xs text-gray-500">{train.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        {train.lastStation || 'N/A'} → {train.nextStation || 'N/A'}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 pl-5">
                        <span>Last Maint: {train.lastMaintenance}</span>
                        <span className="text-gray-300">•</span>
                        <span>Next: {train.nextMaintenance}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">{train.speed} <span className="text-[10px] font-medium text-gray-400">KM/H</span></p>
                        <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${Math.min((train.speed / 130) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className={cn("text-sm font-bold", train.delay > 0 ? "text-amber-600" : "text-gray-900")}>
                      {train.delay} min
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold uppercase px-1.5 py-0",
                      train.status === 'ON_TIME' ? "text-green-600 bg-green-50 border-green-200" : 
                      train.status === 'RUNNING' ? "text-blue-600 bg-blue-50 border-blue-200" :
                      "text-red-600 bg-red-50 border-red-200"
                    )}>
                      {train.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Tooltip>
                          <TooltipTrigger 
                             className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50")}
                             onClick={() => handleAction('Track', train.number)}
                          >
                             <Navigation className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>Live Track</TooltipContent>
                       </Tooltip>
                       
                       <Tooltip>
                          <TooltipTrigger 
                             className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 text-gray-400 hover:text-amber-600 hover:bg-amber-50")}
                             onClick={() => handleAction('Ping', train.number)}
                          >
                             <Signal className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>Ping Driver</TooltipContent>
                       </Tooltip>

                       <Tooltip>
                          <TooltipTrigger 
                             className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 text-gray-400 hover:text-purple-600 hover:bg-purple-50")}
                             onClick={() => handleAction('Inspect', train.number)}
                          >
                             <Wrench className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>Log Maintenance</TooltipContent>
                       </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTrains.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} key="empty-trains" className="px-6 py-12 text-center text-gray-500">
                    No active trains found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    </TooltipProvider>
  );
}
