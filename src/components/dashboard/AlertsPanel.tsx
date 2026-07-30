/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Alert, AlertPriority } from '@/types';
import { cn } from '@/lib/utils';

interface AlertsPanelProps {
  alerts: Alert[];
}

const priorityColors: Record<AlertPriority, string> = {
  [AlertPriority.LOW]: "bg-blue-100 text-blue-700 border-blue-200",
  [AlertPriority.MEDIUM]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [AlertPriority.HIGH]: "bg-orange-100 text-orange-700 border-orange-200",
  [AlertPriority.CRITICAL]: "bg-red-100 text-red-700 border-red-200",
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="h-full border-gray-200/60 shadow-sm flex flex-col">
      <CardHeader className="p-5 pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Recent AI Alerts
          </CardTitle>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-1.5 py-0">
            {alerts.filter(a => a.priority === AlertPriority.CRITICAL).length} Critical
          </Badge>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-100">
          {alerts.map((alert, idx) => (
            <div 
              key={`${alert.id}-${idx}`} 
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase py-0", priorityColors[alert.priority])}>
                  {alert.priority}
                </Badge>
                <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="text-sm font-bold mb-1 group-hover:text-blue-600 transition-colors">{alert.title}</h4>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                <MapPin className="h-3 w-3" />
                {alert.location}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400 font-medium">Confidence:</span>
                      <span className="text-xs font-bold text-blue-600">{alert.confidence}%</span>
                   </div>
                   <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${alert.confidence}%` }} />
                   </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-gray-50/50">
        <button className="w-full py-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
          VIEW ALL ALERTS
        </button>
      </div>
    </Card>
  );
}
