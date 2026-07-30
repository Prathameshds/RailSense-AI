/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  AlertTriangle, 
  Train, 
  Wrench, 
  BarChart3, 
  FileText, 
  Bell, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  BrainCircuit,
  CloudLightning,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  className?: string;
}

const navItems = [
  { group: 'Main', items: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Live Railway Map', icon: MapIcon, path: '/map' },
  ]},
  { group: 'AI & Safety', items: [
    { name: 'AI Agents', icon: BrainCircuit, path: '/agents' },
    { name: 'Incident Management', icon: ShieldAlert, path: '/incidents' },
    { name: 'Alert Center', icon: AlertTriangle, path: '/alerts' },
  ]},
  { group: 'Operations', items: [
    { name: 'Train Monitoring', icon: Train, path: '/trains' },
    { name: 'Weather Intelligence', icon: CloudLightning, path: '/weather' },
    { name: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { name: 'Predictive Analysis', icon: BarChart3, path: '/predictive' },
  ]},
  { group: 'Administration', items: [
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Communications', icon: MessageSquare, path: '/comms' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'System Settings', icon: Settings, path: '/settings' },
  ]}
];

export default function Sidebar({ collapsed, setCollapsed, className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "bg-white border-l flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <ScrollArea className="flex-1">
        <div className="py-4 flex flex-col gap-6">
          {navItems.map((group, idx) => (
            <div key={`group-${group.group}-${idx}`} className="px-3">
              {!collapsed && (
                <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {group.group}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={`${item.name}-${itemIdx}`}
                      to={item.path}
                      className={cn(
                        buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                        "w-full justify-start gap-3 h-10 px-3",
                        isActive ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "text-gray-600 hover:bg-gray-100",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-gray-500")} />
                      {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-full h-8 flex items-center justify-center gap-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
