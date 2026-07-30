/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const timelineEvents = [
  {
    id: 1,
    time: '13:45',
    title: 'Anomalous Vibration',
    description: 'AI detected abnormal frequency at Track KM 124.',
    type: 'critical',
    icon: AlertTriangle,
  },
  {
    id: 2,
    time: '13:46',
    title: 'Risk Scored: 0.92',
    description: 'Probability of rail fracture flagged as high.',
    type: 'warning',
    icon: ShieldAlert,
  },
  {
    id: 3,
    time: '13:48',
    title: 'Speed Restriction Issued',
    description: 'Advisory sent to all North-bound trains in Zone B.',
    type: 'info',
    icon: Info,
  },
  {
    id: 4,
    time: '13:52',
    title: 'Maintenance Ticket #421',
    description: 'Ticket auto-assigned to Engineer Team 4.',
    type: 'success',
    icon: CheckCircle2,
  },
];

export default function Timeline() {
  return (
    <div className="space-y-6">
      {timelineEvents.map((event, idx) => (
        <div key={`${event.id}-${idx}`} className="relative pl-6 pb-6 last:pb-0">
          {idx !== timelineEvents.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-100" />
          )}
          <div className={cn(
            "absolute left-0 top-1 h-[22px] w-[22px] rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10",
            event.type === 'critical' ? "bg-red-500" :
            event.type === 'warning' ? "bg-orange-500" :
            event.type === 'success' ? "bg-green-500" :
            "bg-blue-500"
          )}>
            <event.icon className="h-2.5 w-2.5 text-white" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400">{event.time}</span>
              <span className={cn(
                "text-[8px] font-bold uppercase tracking-wider",
                event.type === 'critical' ? "text-red-500" :
                event.type === 'warning' ? "text-orange-500" :
                event.type === 'success' ? "text-green-500" :
                "text-blue-500"
              )}>
                {event.type}
              </span>
            </div>
            <h4 className="text-xs font-bold text-gray-900">{event.title}</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
