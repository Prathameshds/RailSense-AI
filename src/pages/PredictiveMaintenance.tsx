/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Calendar,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const assets = [
  { id: 'TRK-124', name: 'Track Segment KM 124', health: 62, risk: 92, life: '4.2 months', priority: 'critical' },
  { id: 'SIG-42', name: 'West Approach Signal S-42', health: 84, risk: 45, life: '1.2 years', priority: 'medium' },
  { id: 'PNT-12', name: 'Switch Point P-12', health: 78, risk: 32, life: '8 months', priority: 'low' },
  { id: 'OHL-04', name: 'Catenary Wire C-04', health: 91, risk: 12, life: '2.5 years', priority: 'none' },
];

export default function PredictiveMaintenance() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Predictive Maintenance</h1>
          <p className="text-gray-500 mt-1">AI-driven failure forecasting and remaining useful life (RUL) estimation.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white gap-2">
            <Calendar className="h-4 w-4" />
            Forecast View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="col-span-1 md:col-span-2 border-gray-200/60 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 border-b">
               <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-blue-600" />
                  Asset Health Forecasting
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="space-y-8">
                  {assets.map((asset, idx) => (
                    <div key={`${asset.id}-${idx}`} className="space-y-3">
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <p className="text-xs font-bold text-gray-900">{asset.name}</p>
                             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{asset.id} • RUL: {asset.life}</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-[9px] font-bold uppercase",
                            asset.priority === 'critical' ? "bg-red-50 text-red-700 border-red-100" :
                            asset.priority === 'medium' ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                            "bg-green-50 text-green-700 border-green-100"
                          )}>
                            {asset.priority}
                          </Badge>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex-1 space-y-1.5">
                             <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Health Score</span>
                                <span>{asset.health}%</span>
                             </div>
                             <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${asset.health}%` }}
                                  className={cn(
                                    "h-full rounded-full",
                                    asset.health < 70 ? "bg-red-500" : "bg-green-500"
                                  )} 
                                />
                             </div>
                          </div>
                          <div className="w-px h-8 bg-gray-100" />
                          <div className="space-y-0.5 min-w-[80px]">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Failure Risk</p>
                             <p className={cn("text-lg font-bold", asset.risk > 80 ? "text-red-600" : "text-gray-900")}>{asset.risk}%</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="bg-gray-900 text-white border-none shadow-xl p-6 relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2">
                     <TrendingUp className="h-3.5 w-3.5" />
                     Forecast Summary
                  </h3>
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <p className="text-3xl font-bold">14.2%</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Cost Savings Predicted</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-3xl font-bold text-green-400">820h</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Downtime Prevented</p>
                     </div>
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-bold h-10 shadow-lg shadow-blue-900/20">
                        GENERATE FORECAST REPORT
                     </Button>
                  </div>
               </div>
               <BarChart3 className="absolute -right-8 -bottom-8 h-40 w-40 text-white/5" />
            </Card>

            <Card className="p-6 border-gray-200/60 shadow-sm flex flex-col gap-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
                  Pre-emptive Alert
               </h3>
               <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-orange-900 mb-1">Upcoming Replacement Required</p>
                  <p className="text-[10px] text-orange-700 leading-relaxed">
                     Lonavala Sector signal batteries showing abnormal discharge patterns. Replacement recommended within 7 days.
                  </p>
               </div>
               <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  VIEW ASSET TIMELINE <ChevronRight className="h-3 w-3 ml-1" />
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
