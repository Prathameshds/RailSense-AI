/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  Activity,
  ChevronRight,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { incidents } from '@/mockData';
import { AlertPriority, Incident } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const priorityColors: Record<AlertPriority, string> = {
  [AlertPriority.LOW]: "bg-blue-50 text-blue-700 border-blue-100",
  [AlertPriority.MEDIUM]: "bg-yellow-50 text-yellow-700 border-yellow-100",
  [AlertPriority.HIGH]: "bg-orange-50 text-orange-700 border-orange-100",
  [AlertPriority.CRITICAL]: "bg-red-50 text-red-700 border-red-100",
};

const statusColors: Record<string, string> = {
  'open': 'bg-gray-100 text-gray-700',
  'investigating': 'bg-blue-100 text-blue-700',
  'resolved': 'bg-green-100 text-green-700',
  'closed': 'bg-gray-200 text-gray-500',
};

export default function IncidentManagement() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Incident Management</h1>
          <p className="text-gray-500 mt-1">Track and resolve safety incidents identified by AI agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white gap-2">
            <FileText className="h-4 w-4" />
            Export Log
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <ShieldAlert className="h-4 w-4" />
            New Incident
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Incident List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none shadow-sm transition-all"
            />
          </div>
          
          <div className="space-y-3">
            {incidents.map((incident, idx) => (
              <motion.div
                key={`incident-${incident.id}`}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedIncident(incident)}
                className={cn(
                  "p-4 rounded-2xl border cursor-pointer transition-all",
                  selectedIncident?.id === incident.id 
                    ? "bg-white border-blue-200 shadow-md ring-2 ring-blue-50" 
                    : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="outline" className={cn("text-[10px] font-bold py-0", priorityColors[incident.priority])}>
                    {incident.priority}
                  </Badge>
                  <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-sm font-bold mb-1 line-clamp-1">{incident.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
                  <MapPin className="h-3 w-3" />
                  {incident.location}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0", statusColors[incident.status])}>
                    {incident.status}
                  </Badge>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all",
                    selectedIncident?.id === incident.id ? "text-blue-500 translate-x-1" : "text-gray-300"
                  )} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Incident Detail */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedIncident ? (
              <motion.div
                key={selectedIncident.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Card className="border-gray-200 shadow-lg overflow-hidden">
                  <CardHeader className="p-6 border-b bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-400 tracking-widest">{selectedIncident.id}</span>
                          <Badge className={cn("text-[10px] font-bold uppercase", statusColors[selectedIncident.status])}>
                            {selectedIncident.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold">{selectedIncident.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 px-4 font-bold text-xs bg-white">ASSIGN</Button>
                        <Button size="sm" className="h-9 px-4 font-bold text-xs bg-green-600 hover:bg-green-700 shadow-sm">RESOLVE</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</p>
                        <div className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full", 
                            selectedIncident.priority === AlertPriority.CRITICAL ? "bg-red-500" : "bg-orange-500"
                          )} />
                          <p className="text-sm font-bold text-gray-900 uppercase">{selectedIncident.priority}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reported Time</p>
                        <p className="text-sm font-bold text-gray-900">{new Date(selectedIncident.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Team</p>
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-blue-500" />
                          <p className="text-sm font-bold text-gray-900">{selectedIncident.assignedTeam}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-blue-500" />
                        Description
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {selectedIncident.description}
                      </p>
                    </div>

                    {/* Sensor Readings */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-blue-500" />
                        Telemetry Snapshots
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {selectedIncident.sensorReadings.map((reading, idx) => (
                          <div key={`${reading.label}-${idx}`} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{reading.label}</p>
                            <div className="flex items-center justify-between">
                              <p className={cn("text-lg font-bold", reading.status === 'anomaly' ? "text-red-600" : "text-gray-900")}>
                                {reading.value}
                              </p>
                              {reading.status === 'anomaly' && (
                                <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Explainability */}
                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shrink-0">
                          <BrainCircuit className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <h5 className="text-xs font-bold uppercase tracking-widest text-blue-100">AI Logic Reasoning</h5>
                             <span className="h-1 w-1 rounded-full bg-blue-300" />
                             <span className="text-[10px] font-bold text-blue-200">CONFIDENCE: 92%</span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">
                            {selectedIncident.aiReasoning}
                          </p>
                          <div className="pt-2 flex items-center gap-3">
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-100">
                                <CheckCircle2 className="h-3 w-3" />
                                Recommended Action: Immediate onsite vibration analysis and ballast stabilization.
                             </div>
                          </div>
                        </div>
                      </div>
                      <BrainCircuit className="absolute -right-8 -bottom-8 h-48 w-48 text-white/5" />
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline Integration in Detail View */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                   <h5 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      Incident Event Log
                   </h5>
                      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                      {[
                        { time: '13:45', action: 'Anomaly Detected', agent: 'Anomaly Agent', desc: 'Neural patterns flagged KM 124 vibration amplitude.' },
                        { time: '13:48', action: 'Incident Auto-Generated', agent: 'Risk Agent', desc: 'Critical risk threshold exceeded (0.92).' },
                        { time: '13:50', action: 'Assigned to Team 4', agent: 'Maintenance Agent', desc: 'Work order #421 dispatched to nearest depot.' },
                      ].map((event, idx) => (
                        <div key={`${event.time}-${idx}`} className="relative">
                          <div className="absolute -left-8 top-1 h-[22px] w-[22px] rounded-full bg-white border-2 border-blue-500 z-10 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-gray-900">{event.action}</p>
                              <p className="text-xs text-gray-500">{event.desc}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">{event.time}</p>
                              <p className="text-[10px] font-medium text-blue-600">{event.agent}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div key="incident-empty-state" className="h-full flex items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center">
                <div className="space-y-3">
                   <ShieldAlert className="h-12 w-12 text-gray-300 mx-auto" />
                   <h3 className="font-bold text-gray-400">Select an incident to view details</h3>
                   <p className="text-xs text-gray-400 max-w-xs mx-auto">Click on an incident from the list on the left to see full AI reasoning and telemetry.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
