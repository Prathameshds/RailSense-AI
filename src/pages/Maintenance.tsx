/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Activity,
  History,
  AlertCircle,
  Plus,
  ArrowUpRight,
  User,
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const tickets = [
  { id: 'TKT-1042', asset: 'Track KM 124', priority: 'critical', status: 'In Progress', team: 'Team 4', due: '14:30', location: 'Zone B' },
  { id: 'TKT-1038', asset: 'Signal S-42', priority: 'high', status: 'Scheduled', team: 'S&T Alpha', due: '16:00', location: 'Nagpur West' },
  { id: 'TKT-1025', asset: 'Point Switch P-12', priority: 'medium', status: 'Open', team: 'Team 2', due: '18:00', location: 'Pune JN' },
  { id: 'TKT-1012', asset: 'Overhead Line C-04', priority: 'low', status: 'Completed', team: 'Electrical B', due: 'Yesterday', location: 'Lonavala' },
];

export default function Maintenance() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Maintenance Hub</h1>
          <p className="text-gray-500 mt-1">Manage active work orders and asset health inspections.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white gap-2">
            <History className="h-4 w-4" />
            History
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Open Tickets', value: '12', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'In Progress', value: '24', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Scheduled', value: '12', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Resolved Today', value: '156', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, idx) => (
          <Card key={`${stat.label}-${idx}`} className="border-gray-200/60 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200/60 shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b bg-gray-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-600" />
              Active Maintenance Tickets
            </CardTitle>
            <div className="flex items-center gap-2">
               <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  className="bg-white border rounded-lg py-1.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID & Asset</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Team</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Time</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((t, idx) => (
                  <tr key={`${t.id}-${idx}`} className="hover:bg-gray-50/30 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{t.id}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {t.asset} ({t.location})
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-2 py-0",
                        t.priority === 'critical' ? "bg-red-50 text-red-700 border-red-100" :
                        t.priority === 'high' ? "bg-orange-50 text-orange-700 border-orange-100" :
                        "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            t.status === 'Completed' ? "bg-green-500" : "bg-blue-500"
                          )} />
                          <span className="text-xs font-medium text-gray-700">{t.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                             <User className="h-3 w-3 text-gray-500" />
                          </div>
                          <span className="text-xs font-bold text-gray-900">{t.team}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {t.due}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                          <MoreHorizontal className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </Card>
    </div>
  );
}
