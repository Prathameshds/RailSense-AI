/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Brain, 
  Eye, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Microscope,
  Network
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const agents = [
  {
    id: 'vision',
    name: 'Computer Vision Agent',
    description: 'Scanning track beds for foreign objects and debris.',
    icon: Eye,
    status: 'Operational',
    load: 68,
    incidents: 0,
    color: 'blue'
  },
  {
    id: 'acoustic',
    name: 'Acoustic Signature Monitor',
    description: 'Analyzing wheel-on-rail sound patterns for defects.',
    icon: Network,
    status: 'Alert',
    load: 82,
    incidents: 2,
    color: 'amber'
  },
  {
    id: 'structural',
    name: 'Structural Integrity AI',
    description: 'Predicting bridge and tunnel stress failures.',
    icon: Brain,
    status: 'Operational',
    load: 45,
    incidents: 0,
    color: 'green'
  },
  {
    id: 'neural',
    name: 'Neural Traffic Optimizer',
    description: 'Heuristic scheduling for maximum throughput.',
    icon: Zap,
    status: 'Operational',
    load: 91,
    incidents: 0,
    color: 'purple'
  }
];

export default function AIMonitoring() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {agents.map((agent, idx) => (
        <motion.div
          key={`${agent.id}-${idx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-${agent.color}-50 text-${agent.color}-600 border border-${agent.color}-100`}>
                <agent.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{agent.name}</h4>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{agent.status}</p>
              </div>
            </div>
            {agent.status === 'Alert' ? (
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
                <AlertTriangle className="h-3 w-3 mr-1" /> Warning
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Active
              </Badge>
            )}
          </div>

          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            {agent.description}
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Computational Load</span>
                <span className="text-gray-900">{agent.load}%</span>
              </div>
              <Progress value={agent.load} className="h-1.5" />
            </div>

            <div className="flex items-center justify-between pt-2">
               <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Latency</p>
                    <p className="text-xs font-bold text-gray-900">12ms</p>
                  </div>
                  <div className="w-px h-6 bg-gray-100" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Incidents</p>
                    <p className={`text-xs font-bold ${agent.incidents > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{agent.incidents}</p>
                  </div>
               </div>
               <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={`micro-icon-${agent.id}-${i}`} className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                       <Microscope className="h-3 w-3 text-gray-400" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
