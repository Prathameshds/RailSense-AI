/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Activity,
  Train,
  Brain,
  AlertTriangle,
  FileWarning,
  Ticket,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

const iconMap: Record<string, any> = {
  railway: Activity,
  train: Train,
  sensors: Activity, // Mocking sensors with Activity as Sensors isn't in Lucide
  brain: Brain,
  alert: AlertTriangle,
  incident: FileWarning,
  ticket: Ticket,
  heart: Heart,
};

export default function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  const Icon = iconMap[icon] || Activity;
  const isPositive = change > 0;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card className="overflow-hidden border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
              <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold",
              trend === 'up' ? "bg-green-50 text-green-700" : 
              trend === 'down' ? "bg-red-50 text-red-700" : 
              "bg-gray-50 text-gray-700"
            )}>
              {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {trend === 'neutral' && <Minus className="h-3 w-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">vs. last 24h</span>
            
            <div className="ml-auto w-16 h-6 flex items-end gap-[2px]">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={`sparkline-bar-${i}`} 
                  className={cn(
                    "w-full rounded-t-sm",
                    isPositive ? "bg-green-100" : "bg-red-100"
                  )} 
                  style={{ height: `${Math.random() * 100}%` }} 
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
