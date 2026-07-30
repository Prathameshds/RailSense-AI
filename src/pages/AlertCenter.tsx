/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  MoreHorizontal,
  Trash2,
  MailOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { recentAlerts } from '@/mockData';
import { AlertPriority, Alert } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const priorityIcons = {
  [AlertPriority.LOW]: Info,
  [AlertPriority.MEDIUM]: AlertTriangle,
  [AlertPriority.HIGH]: AlertTriangle,
  [AlertPriority.CRITICAL]: AlertTriangle,
};

const priorityStyles = {
  [AlertPriority.LOW]: "text-blue-500 bg-blue-50 border-blue-100",
  [AlertPriority.MEDIUM]: "text-yellow-600 bg-yellow-50 border-yellow-100",
  [AlertPriority.HIGH]: "text-orange-600 bg-orange-50 border-orange-100",
  [AlertPriority.CRITICAL]: "text-red-600 bg-red-50 border-red-100 animate-pulse",
};

export default function AlertCenter() {
  const [filter, setFilter] = React.useState<'all' | AlertPriority>('all');
  const [readAlerts, setReadAlerts] = React.useState<Set<string>>(new Set());

  const filteredAlerts = filter === 'all' 
    ? recentAlerts 
    : recentAlerts.filter(a => a.priority === filter);

  const toggleRead = (id: string) => {
    const next = new Set(readAlerts);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setReadAlerts(next);
  };

  const markAllRead = () => {
    setReadAlerts(new Set(recentAlerts.map(a => a.id)));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Alert Center</h1>
          <p className="text-gray-500 mt-1">Manage and respond to automated system warnings and AI flags.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white h-9 gap-2" onClick={markAllRead}>
            <MailOpen className="h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" className="bg-white h-9 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
            <Trash2 className="h-4 w-4" />
            Clear resolved
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button 
          variant={filter === 'all' ? 'secondary' : 'ghost'} 
          size="sm" 
          onClick={() => setFilter('all')}
          className={cn("h-8 rounded-full px-4 font-bold text-xs", filter === 'all' && "bg-blue-600 text-white hover:bg-blue-700")}
        >
          ALL ALERTS
        </Button>
        {Object.values(AlertPriority).map((p, idx) => (
          <Button 
            key={`${p}-${idx}`}
            variant={filter === p ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter(p)}
            className={cn(
              "h-8 rounded-full px-4 font-bold text-xs uppercase tracking-widest",
              filter === p && "bg-gray-900 text-white hover:bg-black"
            )}
          >
            {p}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, idx) => {
            const Icon = priorityIcons[alert.priority];
            const isRead = readAlerts.has(alert.id);
            return (
              <motion.div
                key={`${alert.id}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={cn(
                  "border-gray-200/60 shadow-sm hover:shadow-md transition-all group overflow-hidden relative",
                  !isRead && "border-l-4 border-l-blue-500"
                )}>
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-stretch">
                      <div className={cn(
                        "w-full sm:w-16 flex items-center justify-center p-4 sm:p-0 border-b sm:border-b-0 sm:border-r border-gray-100",
                        priorityStyles[alert.priority].split(' ')[1] // Get BG color
                      )}>
                        <Icon className={cn("h-6 w-6", priorityStyles[alert.priority].split(' ')[0])} />
                      </div>
                      
                      <div className="flex-1 p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                             <h4 className={cn("text-sm font-bold", !isRead ? "text-gray-900" : "text-gray-500")}>
                                {alert.title}
                             </h4>
                             {!isRead && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className={cn("text-[9px] font-bold uppercase py-0", priorityStyles[alert.priority])}>
                              {alert.priority}
                            </Badge>
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-3xl mb-1">
                          {alert.location}
                        </p>
                        <p className="text-[11px] text-gray-400 leading-relaxed max-w-3xl">
                          {alert.description}
                        </p>
                      </div>

                      <div className="p-5 flex items-center gap-2 sm:border-l border-gray-100 bg-gray-50/30">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 px-4 text-xs font-bold text-blue-600 hover:bg-blue-50"
                          onClick={() => toggleRead(alert.id)}
                        >
                          {isRead ? 'MARK UNREAD' : 'MARK READ'}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-3xl">
             <Bell className="h-12 w-12 text-gray-200 mx-auto mb-4" />
             <h3 className="font-bold text-gray-400">No alerts found</h3>
             <p className="text-xs text-gray-400 mt-1">There are no active alerts matching your current filter.</p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-red-600 text-white border-none shadow-lg p-6 relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Active Critical</h3>
               <p className="text-4xl font-bold">04</p>
            </div>
            <AlertTriangle className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10" />
         </Card>
         <Card className="p-6 border-gray-200/60 shadow-sm flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Notification Volume</h3>
            <div className="flex items-end gap-2 mb-2">
               <p className="text-3xl font-bold text-gray-900">124</p>
               <p className="text-xs font-bold text-red-600 pb-1">+18%</p>
            </div>
            <p className="text-[10px] text-gray-400 font-medium italic">vs same period yesterday</p>
         </Card>
         <Card className="p-6 border-gray-200/60 shadow-sm flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Mean Time to Resolve</h3>
            <div className="flex items-center gap-3">
               <div className="bg-green-50 p-2 rounded-xl text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-xl font-bold text-gray-900">18.4m</p>
                  <p className="text-[10px] font-bold text-green-600 uppercase">Improving</p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
