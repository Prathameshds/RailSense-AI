/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BrainCircuit, 
  Search, 
  Activity, 
  Zap, 
  ShieldCheck, 
  MessageSquare,
  Wrench,
  Bell,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const agents = [
  { 
    name: 'Monitor Agent', 
    icon: Search, 
    status: 'active', 
    speed: '45ms', 
    tasks: 12450, 
    health: 100,
    description: 'Ingests real-time sensor streams and track diagnostics.'
  },
  { 
    name: 'Anomaly Agent', 
    icon: Activity, 
    status: 'active', 
    speed: '120ms', 
    tasks: 842, 
    health: 98,
    description: 'Identifies deviations from standard vibration and acoustic patterns.'
  },
  { 
    name: 'Risk Agent', 
    icon: ShieldCheck, 
    status: 'active', 
    speed: '210ms', 
    tasks: 124, 
    health: 100,
    description: 'Calculates safety scores based on anomaly severity and asset location.'
  },
  { 
    name: 'Decision Agent', 
    icon: Zap, 
    status: 'idle', 
    speed: '-', 
    tasks: 12, 
    health: 95,
    description: 'Determines the optimal response protocol (Speed restrict, stop, inspect).'
  },
  { 
    name: 'Response Agent', 
    icon: Bell, 
    status: 'idle', 
    speed: '-', 
    tasks: 8, 
    health: 100,
    description: 'Executes automated alerts and signals to train drivers and station masters.'
  },
  { 
    name: 'Maintenance Agent', 
    icon: Wrench, 
    status: 'idle', 
    speed: '-', 
    tasks: 42, 
    health: 100,
    description: 'Generates work orders and assigns local maintenance teams.'
  }
];

export default function AIAgents() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-display">AI Multi-Agent Pipeline</h1>
        <p className="text-gray-500 mt-1">Autonomous orchestration of safety monitoring and predictive response.</p>
      </div>

      {/* Pipeline Visualization */}
      <Card className="p-8 border-gray-200/60 shadow-sm bg-gray-50/30 overflow-x-auto">
        <div className="flex items-center gap-4 min-w-[1000px] justify-between relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-100 -translate-y-1/2 z-0" />
          
          {agents.map((agent, idx) => (
            <React.Fragment key={`viz-${agent.name}-${idx}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center gap-4 w-40"
              >
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transition-all border-2",
                  agent.status === 'active' 
                    ? "bg-blue-600 border-blue-400 text-white animate-pulse" 
                    : "bg-white border-gray-200 text-gray-400"
                )}>
                  <agent.icon className="h-8 w-8" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-gray-900">{agent.name}</p>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0",
                    agent.status === 'active' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                  )}>
                    {agent.status}
                  </Badge>
                </div>
              </motion.div>
              {idx < agents.length - 1 && (
                <div className="z-10 bg-white rounded-full p-1 border shadow-sm">
                   <ArrowRight className="h-3 w-3 text-blue-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Agent Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, idx) => (
          <motion.div
            key={`grid-${agent.name}-${idx}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 + 0.5 }}
          >
            <Card className="h-full border-gray-200/60 shadow-sm hover:shadow-md transition-all group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    agent.status === 'active' ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
                  )}>
                    <agent.icon className="h-4 w-4" />
                  </div>
                  {agent.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                   <span className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{agent.health}% HEALTH</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">
                  {agent.description}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Speed</p>
                      <p className="text-sm font-bold text-gray-900">{agent.speed}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks</p>
                      <p className="text-sm font-bold text-gray-900">{agent.tasks.toLocaleString()}</p>
                   </div>
                </div>
                <div className="pt-2">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.health}%` }}
                      className="h-full bg-blue-500 rounded-full" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
