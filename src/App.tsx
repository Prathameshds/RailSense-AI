/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import AIAgents from './pages/AIAgents';
import TrainMonitoring from './pages/TrainMonitoring';
import WeatherIntelligence from './pages/WeatherIntelligence';
import IncidentManagement from './pages/IncidentManagement';
import Maintenance from './pages/Maintenance';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import Analytics from './pages/Analytics';
import AlertCenter from './pages/AlertCenter';

// Placeholder components for other routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
    <div className="bg-gray-100 p-8 rounded-3xl border border-gray-200 border-dashed">
      <h2 className="text-2xl font-bold text-gray-400">{title}</h2>
      <p className="text-gray-500 mt-2 max-w-xs mx-auto">This module is currently being provisioned in the next development phase of RailSense AI.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" expand={false} richColors />
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/agents" element={<AIAgents />} />
          <Route path="/trains" element={<TrainMonitoring />} />
          <Route path="/weather" element={<WeatherIntelligence />} />
          <Route path="/incidents" element={<IncidentManagement />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/predictive" element={<PredictiveMaintenance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<AlertCenter />} />
          
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
