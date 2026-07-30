/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  Area
} from 'recharts';

const safetyData = [
  { name: 'Mon', incidents: 4, resolved: 3 },
  { name: 'Tue', incidents: 2, resolved: 2 },
  { name: 'Wed', incidents: 8, resolved: 6 },
  { name: 'Thu', incidents: 5, resolved: 5 },
  { name: 'Fri', incidents: 3, resolved: 4 },
  { name: 'Sat', incidents: 1, resolved: 1 },
  { name: 'Sun', incidents: 2, resolved: 2 },
];

const efficiencyData = [
  { time: '00:00', delay: 5 },
  { time: '04:00', delay: 2 },
  { time: '08:00', delay: 15 },
  { time: '12:00', delay: 8 },
  { time: '16:00', delay: 20 },
  { time: '20:00', delay: 10 },
  { time: '23:59', delay: 4 },
];

export default function Analytics() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Operations Analytics</h1>
          <p className="text-gray-500 mt-1">Deep insights into system performance, safety trends, and operational efficiency.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 border-gray-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Response Time</h3>
               <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full">
                  <ArrowDownRight className="h-3 w-3" />
                  12%
               </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">4.2 min</p>
            <div className="h-16 mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={safetyData}>
                     <defs>
                        <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="incidents" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRes)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-6 border-gray-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Punctuality Rate</h3>
               <div className="flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-0.5 rounded-full">
                  <ArrowDownRight className="h-3 w-3" />
                  0.4%
               </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">94.8%</p>
            <div className="h-16 mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={efficiencyData}>
                     <Line type="monotone" dataKey="delay" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </ReLineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-6 border-gray-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Maintenance Efficiency</h3>
               <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  8%
               </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">89.2%</p>
            <div className="h-16 mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={safetyData}>
                     <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-gray-200/60 shadow-sm">
            <CardHeader className="p-6 border-b">
               <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  Safety Incident Trends (Weekly)
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={safetyData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="incidents" name="Incidents" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
                     <Bar dataKey="resolved" name="Resolved" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="border-gray-200/60 shadow-sm">
            <CardHeader className="p-6 border-b">
               <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Operational Delay Analysis (24h)
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={efficiencyData}>
                     <defs>
                        <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="delay" name="Delay (min)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDelay)" />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
