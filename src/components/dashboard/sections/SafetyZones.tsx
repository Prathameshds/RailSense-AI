/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  MapPin, 
  UserPlus, 
  Lock,
  Search,
  Scan,
  Construction
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const zones = [
  {
    id: 'z1',
    name: 'Khandala Tunnel West',
    type: 'High Risk',
    status: 'Monitored',
    intrusions: 0,
    activePersonnel: 4,
    lastScan: '2m ago'
  },
  {
    id: 'z2',
    name: 'Lonavala Crossing B',
    type: 'Public Interface',
    status: 'Alert',
    intrusions: 1,
    activePersonnel: 0,
    lastScan: 'Just now'
  },
  {
    id: 'z3',
    name: 'Karjat Main Junction',
    type: 'Operational',
    status: 'Monitored',
    intrusions: 0,
    activePersonnel: 12,
    lastScan: '1m ago'
  },
  {
    id: 'z4',
    name: 'Bridge 42S (Matheran)',
    type: 'Structural Maintenance',
    status: 'Restricted',
    intrusions: 0,
    activePersonnel: 2,
    lastScan: '5m ago'
  }
];

export default function SafetyZones() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-6 relative overflow-hidden h-[200px] border border-white/10">
         <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
               <div>
                  <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                     <Scan className="h-5 w-5 text-blue-400" />
                     Live Perimeter Scan
                  </h3>
                  <p className="text-gray-400 text-xs">AI-augmented object detection active across 42 sectors.</p>
               </div>
               <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-2 animate-pulse" />
                  Real-time
               </Badge>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={`safety-node-${i}`} className="h-8 w-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                       {i}
                    </div>
                  ))}
               </div>
               <span className="text-xs text-gray-400 font-medium">+12 more active nodes</span>
            </div>
         </div>
         
         {/* Decorative Grid Overlay */}
         <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)',
            backgroundSize: '24px 24px'
         }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {zones.map((zone, idx) => (
          <div 
            key={`${zone.id}-${idx}`}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${zone.status === 'Alert' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                   {zone.status === 'Alert' ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                   <h4 className="font-bold text-gray-900 text-xs">{zone.name}</h4>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{zone.type}</p>
                </div>
             </div>
             <div className="text-right">
                <p className={`text-xs font-bold ${zone.intrusions > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                   {zone.intrusions} <span className="text-[10px] font-medium text-gray-400 ml-1">INTRUSIONS</span>
                </p>
                <p className="text-[10px] text-gray-400 font-medium">Last: {zone.lastScan}</p>
             </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full h-10 font-bold text-xs uppercase tracking-widest bg-white">
         <Search className="h-4 w-4 mr-2" />
         Search Specific Sector
      </Button>
    </div>
  );
}
