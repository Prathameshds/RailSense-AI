import * as React from 'react';
import { 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon,
  Download,
  Calendar,
  Filter,
  ShieldAlert,
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  Layers,
  Database,
  Lock,
  Globe,
  Bell,
  HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Analytics from './Analytics';

// --- Reports Tab Components ---
const ReportsTab = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold">Daily Operations Summary</CardTitle>
          <CardDescription>Generated automatically at 00:00</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status: Ready</span>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-blue-600">
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold">Safety Compliance Audit</CardTitle>
          <CardDescription>Q3 2026 Internal Audit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status: In Progress (85%)</span>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-gray-400" disabled>
              <Clock className="h-3.5 w-3.5" />
              Pending
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold">Maintenance ROI Analysis</CardTitle>
          <CardDescription>Annual financial impact report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status: Ready</span>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-blue-600">
              <Download className="h-3.5 w-3.5" />
              XLSX
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="border-gray-200/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50">
        <div>
          <CardTitle className="text-base font-bold">Report Repository</CardTitle>
          <CardDescription>Access and manage all historical system reports</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {[
            { name: 'Incident_Log_July_2026.pdf', date: '2026-07-29', size: '2.4 MB', type: 'Safety' },
            { name: 'Punctuality_Analysis_Week_30.pdf', date: '2026-07-28', size: '1.1 MB', type: 'Operations' },
            { name: 'Rolling_Stock_Health_Status.xlsx', date: '2026-07-27', size: '4.5 MB', type: 'Maintenance' },
            { name: 'Network_Throughput_Heatmap.png', date: '2026-07-26', size: '8.2 MB', type: 'Analytics' },
            { name: 'Energy_Consumption_Q2_Final.pdf', date: '2026-07-25', size: '3.7 MB', type: 'Financial' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{report.type} • {report.date} • {report.size}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// --- Settings Tab Components ---
const SettingsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="lg:col-span-1 space-y-4">
      {[
        { icon: Globe, label: 'General Configuration', desc: 'Core system parameters and localization' },
        { icon: Lock, label: 'Security & Access', desc: 'Authentication, API keys, and MFA' },
        { icon: Bell, label: 'Notification Engine', desc: 'Alert routing and communication channels' },
        { icon: Database, label: 'Data Retention', desc: 'Archiving policies and backup storage' },
        { icon: HardDrive, label: 'System Health', desc: 'Server status and resource monitoring' },
      ].map((item, i) => (
        <button 
          key={i} 
          className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all ${i === 0 ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'}`}
        >
          <div className={`p-2 rounded-lg ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            <item.icon className="h-4 w-4" />
          </div>
          <div>
            <p className={`text-sm font-bold ${i === 0 ? 'text-blue-900' : 'text-gray-900'}`}>{item.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        </button>
      ))}
    </div>

    <Card className="lg:col-span-2 border-gray-200/60 shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-base font-bold">General Configuration</CardTitle>
        <CardDescription>Manage global rail network settings and environment variables.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timezone & Localization</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Primary Timezone</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>Asia/Kolkata (IST)</option>
                <option>UTC</option>
                <option>Europe/London (GMT)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Display Language</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>English (UK)</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Operational Thresholds</h4>
          <div className="space-y-6">
            {[
              { label: 'Critical Delay Threshold', unit: 'minutes', value: 15 },
              { label: 'High Traffic Density Limit', unit: 'trains/block', value: 4 },
              { label: 'Safety Compliance Warning %', unit: 'percent', value: 98.5 },
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{setting.label}</p>
                  <p className="text-xs text-gray-500">Triggers an immediate system-wide notification</p>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={setting.value} 
                    className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right"
                  />
                  <span className="text-xs text-gray-400 font-medium w-16">{setting.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Maintenance Mode</h4>
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-orange-900">Live Traffic Bypass</p>
                <p className="text-xs text-orange-700">Routes all live API calls to simulated data nodes for system testing.</p>
              </div>
            </div>
            <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all" />
            </div>
          </div>
        </div>
      </CardContent>
      <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">Save Configuration</Button>
      </div>
    </Card>
  </div>
);

export default function Administration() {
  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Administration</h1>
          <p className="text-gray-500 mt-1">Enterprise control center for RailSense AI system management.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Clock className="h-3.5 w-3.5" />
            Uptime: 99.98%
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg">
            <Activity className="h-3.5 w-3.5" />
            All Systems Operational
          </div>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="bg-gray-100/50 p-1 mb-8 border border-gray-200/60 w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="analytics" className="gap-2 px-6">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2 px-6">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 px-6">
            <SettingsIcon className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-8">
          <Analytics isTabContent />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
