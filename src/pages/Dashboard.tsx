/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import KPICard from '@/components/dashboard/KPICard';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import MapComponent from '@/components/dashboard/MapComponent';
import AIMonitoring from '@/components/dashboard/sections/AIMonitoring';
import SafetyZones from '@/components/dashboard/sections/SafetyZones';
import { kpis, recentAlerts } from '@/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  FileText,
  Download,
  Calendar,
  BrainCircuit,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [stats, setStats] = React.useState({
    active: '...',
    delayed: '...',
    perf: '...',
    integrity: '99.9%'
  });
  const [activeTab, setActiveTab] = React.useState('ops');

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/rail-radar');
        const data = await res.json();
        if (data.trains) {
          const active = data.totalActive || data.trains.length;
          const delayed = data.trains.filter((t: any) => t.status === 'DELAYED').length;
          const perf = data.trains.length > 0 
            ? Math.round(((data.trains.length - delayed) / data.trains.length) * 100) 
            : 100;
          
          setStats({
            active: active.toLocaleString(),
            delayed: delayed.toString(),
            perf: `${perf}%`,
            integrity: '99.9%'
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const kpiData = [
    { 
      id: 'active', 
      title: 'Active Trains', 
      value: stats.active, 
      change: 12, 
      trend: 'up' as const, 
      icon: 'train'
    },
    { 
      id: 'delay', 
      title: 'Critical Delays', 
      value: stats.delayed, 
      change: 2, 
      trend: 'down' as const, 
      icon: 'alert'
    },
    { 
      id: 'ontime', 
      title: 'On-Time Perf.', 
      value: stats.perf, 
      change: 0.5, 
      trend: 'up' as const, 
      icon: 'brain'
    },
    { 
      id: 'safety', 
      title: 'System Integrity', 
      value: stats.integrity, 
      change: 0, 
      trend: 'neutral' as const, 
      icon: 'heart'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">RailSense Control Hub</h1>
          <p className="text-gray-500 font-medium text-sm">Autonomous railway monitoring and multi-agent safety enforcement.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white gap-2 h-10 px-4 rounded-xl border-gray-200 shadow-sm font-bold text-xs uppercase tracking-widest">
            <Calendar className="h-4 w-4 text-blue-600" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Button>
          <Button variant="default" size="sm" className="bg-gray-900 hover:bg-black text-white gap-2 h-10 px-6 rounded-xl shadow-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02]">
            <Download className="h-4 w-4" />
            Export Live Data
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpiData.map((kpi, idx) => (
          <motion.div key={`${kpi.id}-${idx}`} variants={item}>
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Map & AI Status */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="ops" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-gray-100/50 backdrop-blur-md border p-1 rounded-2xl">
                <TabsTrigger value="ops" className="gap-2 px-6 py-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all">
                  <LayoutDashboard className="h-4 w-4" />
                  Live Ops
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2 px-6 py-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all">
                  <Activity className="h-4 w-4" />
                  AI Monitoring
                </TabsTrigger>
                <TabsTrigger value="safety" className="gap-2 px-6 py-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all">
                  <ShieldAlert className="h-4 w-4" />
                  Safety Zones
                </TabsTrigger>
              </TabsList>
              
              <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>50ms Latency</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span>Neural Link OK</span>
                 </div>
              </div>
            </div>
            
              <AnimatePresence mode="wait">
                {activeTab === 'ops' && (
                  <TabsContent key="ops" value="ops" className="mt-0 focus-visible:outline-none ring-0 outline-none">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="h-[600px] rounded-3xl overflow-hidden border border-gray-200/60 shadow-2xl relative"
                    >
                      <MapComponent />
                    </motion.div>
                  </TabsContent>
                )}
                
                {activeTab === 'ai' && (
                  <TabsContent key="ai" value="ai" className="mt-0 focus-visible:outline-none">
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <AIMonitoring />
                    </motion.div>
                  </TabsContent>
                )}

                {activeTab === 'safety' && (
                  <TabsContent key="safety" value="safety" className="mt-0 focus-visible:outline-none">
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <SafetyZones />
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 text-gray-400">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Sensor Health Status
                   </h3>
                   <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="space-y-6">
                   {[
                     { name: 'Vibration Sensors', status: 'Online', health: 99.4, color: 'bg-blue-600' },
                     { name: 'Acoustic Detectors', status: 'Online', health: 98.2, color: 'bg-blue-600' },
                     { name: 'Thermal Cameras', status: 'Syncing', health: 94.1, color: 'bg-purple-600' },
                     { name: 'Signal Receivers', status: 'Warning', health: 82.5, color: 'bg-amber-600' },
                   ].map((sensor, idx) => (
                      <div key={`${sensor.name}-${idx}`} className="space-y-2">
                         <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 text-xs">{sensor.name}</span>
                            <span className="font-black text-gray-900 text-xs tracking-tighter">{sensor.health}%</span>
                         </div>
                         <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${sensor.health}%` }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className={cn("h-full rounded-full", sensor.color)} 
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 text-gray-400">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Maintenance Overview
                   </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-10">
                   <div className="flex items-center justify-around text-center">
                      <div className="space-y-2">
                         <p className="text-4xl font-black text-gray-900 tracking-tighter">24</p>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Progress</p>
                      </div>
                      <div className="w-px h-12 bg-gray-100" />
                      <div className="space-y-2">
                         <p className="text-4xl font-black text-gray-900 tracking-tighter">12</p>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scheduled</p>
                      </div>
                      <div className="w-px h-12 bg-gray-100" />
                      <div className="space-y-2">
                         <p className="text-4xl font-black text-green-600 tracking-tighter">156</p>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolved</p>
                      </div>
                   </div>
                   <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-[0.2em] h-12 rounded-2xl border-2 hover:bg-gray-50 transition-all">
                      Open Maintenance Hub
                   </Button>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Alerts & Feed */}
        <div className="space-y-8">
          <div className="h-[600px] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <AlertsPanel alerts={recentAlerts} />
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/10"
          >
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-500 rounded-xl">
                      <TrendingUp className="h-5 w-5" />
                   </div>
                   <h4 className="text-sm font-black uppercase tracking-[0.2em]">Predictive Insight</h4>
                </div>
                
                <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
                   Based on <span className="text-blue-400 font-bold">Current Vibration Patterns</span>, the Lonavala segment may require inspection within <span className="text-white font-bold">48 hours</span> to maintain 99.9% safety rating.
                </p>
                
                <div className="flex items-center justify-between">
                   <Button variant="secondary" size="sm" className="bg-white text-gray-900 hover:bg-blue-50 font-black text-[10px] uppercase tracking-widest px-8 h-10 rounded-xl transition-all">
                      Approve Inspection
                   </Button>
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <BrainCircuit className="h-5 w-5 text-blue-400" />
                   </div>
                </div>
             </div>
             
             {/* Decorative Background Elements */}
             <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit className="h-64 w-64 text-blue-500" />
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
          </motion.div>
          
          <Card className="p-6 border-gray-100 shadow-sm bg-blue-50/30 border-dashed border-2 rounded-[2rem]">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-blue-100">
                   <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Next AI Training Run</p>
                   <p className="text-sm font-bold text-gray-900">Scheduled in 4h 12m</p>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

