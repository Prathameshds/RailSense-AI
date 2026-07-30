/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Zap,
  Users as UsersIcon,
  Activity,
  Filter,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart
} from 'recharts';

const safetyData = [
  { name: 'Mon', incidents: 4, resolved: 3, risk: 20 },
  { name: 'Tue', incidents: 2, resolved: 2, risk: 15 },
  { name: 'Wed', incidents: 8, resolved: 6, risk: 45 },
  { name: 'Thu', incidents: 5, resolved: 5, risk: 30 },
  { name: 'Fri', incidents: 3, resolved: 4, risk: 25 },
  { name: 'Sat', incidents: 1, resolved: 1, risk: 10 },
  { name: 'Sun', incidents: 2, resolved: 2, risk: 12 },
];

const efficiencyData = [
  { time: '00:00', delay: 5, efficiency: 98, throughput: 120 },
  { time: '04:00', delay: 2, efficiency: 99, throughput: 80 },
  { time: '08:00', delay: 15, efficiency: 92, throughput: 350 },
  { time: '12:00', delay: 8, efficiency: 95, throughput: 280 },
  { time: '16:00', delay: 20, efficiency: 88, throughput: 420 },
  { time: '20:00', delay: 10, efficiency: 94, throughput: 310 },
  { time: '23:59', delay: 4, efficiency: 97, throughput: 150 },
];

const regionalData = [
  { zone: 'Northern', performance: 94, incidents: 12, maintenance: 88 },
  { zone: 'Southern', performance: 96, incidents: 5, maintenance: 92 },
  { zone: 'Eastern', performance: 89, incidents: 22, maintenance: 84 },
  { zone: 'Western', performance: 92, incidents: 14, maintenance: 86 },
  { zone: 'Central', performance: 95, incidents: 8, maintenance: 90 },
];

const alertDistribution = [
  { name: 'Signal Failure', value: 35, color: '#ef4444' },
  { name: 'Track Issue', value: 25, color: '#f97316' },
  { name: 'Rolling Stock', value: 20, color: '#3b82f6' },
  { name: 'Human Factor', value: 15, color: '#10b981' },
  { name: 'Weather', value: 5, color: '#8b5cf6' },
];

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#8b5cf6'];

export default function Analytics({ isTabContent = false }: { isTabContent?: boolean }) {
  return (
    <div className={`space-y-8 ${isTabContent ? '' : 'p-6 max-w-[1600px] mx-auto pb-12'}`}>
      {!isTabContent && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Administration Analytics</h1>
            <p className="text-gray-500 mt-1">Holistic performance monitoring and resource optimization dashboard.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="bg-white gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="bg-white gap-2">
              <Calendar className="h-4 w-4" />
              July 2026
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Download className="h-4 w-4" />
              Generate PDF Report
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Overall Punctuality', value: '94.8%', trend: '+0.2%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Safety Compliance', value: '99.9%', trend: '+0.1%', icon: ShieldAlert, color: 'text-green-600', bg: 'bg-green-50' },
           { label: 'Active Alerts', value: '14', trend: '-12%', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
           { label: 'Avg Throughput', value: '284', trend: '+5.4%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
         ].map((stat, i) => (
           <Card key={i} className="p-4 border-gray-200/60 shadow-sm flex items-center gap-4">
             <div className={`p-3 rounded-xl ${stat.bg}`}>
               <stat.icon className={`h-5 w-5 ${stat.color}`} />
             </div>
             <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
               <div className="flex items-baseline gap-2">
                 <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                 <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                   {stat.trend}
                 </span>
               </div>
             </div>
           </Card>
         ))}
      </div>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="bg-gray-100/50 p-1 mb-8 border border-gray-200/60">
          <TabsTrigger value="operations" className="gap-2">
            <Activity className="h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="safety" className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Safety & Risk
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="regional" className="gap-2">
            <Layers className="h-4 w-4" />
            Regional Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-gray-200/60 shadow-sm overflow-hidden">
               <CardHeader className="p-6 border-b bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold">Network Throughput vs. Delay</CardTitle>
                      <CardDescription>Correlation between traffic volume and operational latency (24h)</CardDescription>
                    </div>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
               </CardHeader>
               <CardContent className="p-6 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="top" height={36}/>
                      <Bar yAxisId="left" dataKey="throughput" name="Trains / Hr" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                      <Line yAxisId="right" type="monotone" dataKey="delay" name="Avg Delay (min)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>

            <Card className="border-gray-200/60 shadow-sm flex flex-col">
              <CardHeader className="p-6 border-b">
                <CardTitle className="text-base font-bold">Operational Efficiency Index</CardTitle>
                <CardDescription>Efficiency percentage over time</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-center gap-8">
                <div className="relative h-48 w-48 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 95.2 }, { value: 4.8 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-900">95.2%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Energy Utilization', value: '88%', color: 'bg-blue-500' },
                    { label: 'Workforce Allocation', value: '94%', color: 'bg-green-500' },
                    { label: 'Equipment Health', value: '82%', color: 'bg-orange-500' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-medium">{item.label}</span>
                        <span className="text-gray-900 font-bold">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-gray-200/60 shadow-sm">
               <CardHeader className="p-6 border-b">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                     <AlertTriangle className="h-5 w-5 text-orange-500" />
                     Incident Classification
                  </CardTitle>
                  <CardDescription>Breakdown of safety reports by root cause</CardDescription>
               </CardHeader>
               <CardContent className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={alertDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {alertDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>

            <Card className="border-gray-200/60 shadow-sm">
               <CardHeader className="p-6 border-b">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-red-500" />
                     Safety Risk Exposure Score
                  </CardTitle>
                  <CardDescription>Weekly AI-calculated system risk level</CardDescription>
               </CardHeader>
               <CardContent className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={safetyData}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="risk" name="Risk Score" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-gray-200/60 shadow-sm">
                <CardHeader className="p-6 border-b">
                  <CardTitle className="text-base font-bold">Predictive vs. Reactive Maintenance</CardTitle>
                  <CardDescription>Maintenance strategy distribution by zone</CardDescription>
                </CardHeader>
                <CardContent className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="zone" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }} />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Legend />
                      <Bar dataKey="maintenance" name="Predictive (%)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                      <Bar dataKey="performance" name="Reactive (%)" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-gray-200/60 shadow-sm">
                  <CardHeader className="p-6">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      AI Maintenance Savings
                    </CardTitle>
                    <p className="text-3xl font-bold mt-2">$2.4M <span className="text-sm font-normal text-green-600 font-bold ml-2">↑ 14% vs LY</span></p>
                    <p className="text-xs text-gray-400 mt-1">Cost avoided through early AI detection of component wear.</p>
                  </CardHeader>
                </Card>

                <Card className="border-gray-200/60 shadow-sm p-6">
                  <h4 className="text-sm font-bold mb-4">Critical Component Lifecycle</h4>
                  <div className="space-y-6">
                    {[
                      { part: 'Brake Systems', health: 92, last: '12 days ago' },
                      { part: 'Signaling Units', health: 78, last: '4 days ago' },
                      { part: 'Pantographs', health: 85, last: '22 days ago' },
                      { part: 'HVAC Units', health: 64, last: 'Yesterday' },
                    ].map((comp, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`h-2 flex-1 bg-gray-100 rounded-full overflow-hidden`}>
                          <div className={`h-full ${comp.health > 80 ? 'bg-green-500' : comp.health > 70 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full`} style={{ width: `${comp.health}%` }} />
                        </div>
                        <div className="w-32">
                          <p className="text-xs font-bold text-gray-900">{comp.part}</p>
                          <p className="text-[10px] text-gray-400">Last check: {comp.last}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{comp.health}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="regional" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-gray-200/60 shadow-sm">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-base font-bold">Regional Performance Heatmap</CardTitle>
              <CardDescription>Zone-wise punctuality and incident correlation</CardDescription>
            </CardHeader>
            <CardContent className="p-6 h-[500px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={regionalData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="zone" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <Tooltip />
                   <Legend />
                   <Bar dataKey="performance" name="Punctuality (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
                   <Bar dataKey="incidents" name="Total Incidents" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={60} />
                 </BarChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

