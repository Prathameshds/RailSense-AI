/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertPriority, KPIData, Alert, Train, UserRole, User, Incident } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@railway.gov.in',
  role: UserRole.CONTROL_ROOM_OPERATOR,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
};

export const kpis: KPIData[] = [
  { id: '1', title: 'Tracks Monitored', value: '12,450 km', change: 2.5, trend: 'up', icon: 'railway' },
  { id: '2', title: 'Active Trains', value: '1,248', change: -0.4, trend: 'down', icon: 'train' },
  { id: '3', title: 'Online Sensors', value: '45,672', change: 1.2, trend: 'up', icon: 'sensors' },
  { id: '4', title: 'AI Decisions Today', value: '3,842', change: 12.5, trend: 'up', icon: 'brain' },
  { id: '5', title: 'Critical Alerts', value: '14', change: -2, trend: 'down', icon: 'alert' },
  { id: '6', title: 'Total Incidents', value: '124', change: 5.4, trend: 'up', icon: 'incident' },
  { id: '7', title: 'Maintenance Tickets', value: '89', change: -8.2, trend: 'down', icon: 'ticket' },
  { id: '8', title: 'Overall System Health', value: '98.2%', change: 0.1, trend: 'up', icon: 'heart' },
];

export const recentAlerts: Alert[] = [
  {
    id: 'a1',
    title: 'Anomalous Vibration Detected',
    location: 'Sector 4, Zone B (Track KM 124)',
    timestamp: '2026-07-26T13:45:00Z',
    priority: AlertPriority.CRITICAL,
    confidence: 94,
    status: 'active',
    description: 'Sensors detected vibration patterns exceeding safety thresholds for high-speed corridor.',
  },
  {
    id: 'a2',
    title: 'Signal Fluctuation',
    location: 'Nagpur Junction - West Approach',
    timestamp: '2026-07-26T13:40:00Z',
    priority: AlertPriority.HIGH,
    confidence: 88,
    status: 'investigating',
    description: 'Intermittent signal loss detected on North-bound main line. AI suggests potential wiring fault.',
  },
  {
    id: 'a3',
    title: 'Nearby Obstruction Alert',
    location: 'Pune-Lonavala Section (KM 42)',
    timestamp: '2026-07-26T13:30:00Z',
    priority: AlertPriority.MEDIUM,
    confidence: 82,
    status: 'active',
    description: 'CCTV AI detected unauthorized movement near track perimeter.',
  },
];

export const activeTrains: Train[] = [
  {
    id: 't1',
    number: '12002',
    name: 'Bhopal Shatabdi',
    currentStation: 'Agra Cantt',
    speed: 130,
    direction: 'North',
    signalStatus: 'green',
    alertLevel: AlertPriority.LOW,
    eta: '14:20',
    status: 'on-time',
  },
  {
    id: 't2',
    number: '22436',
    name: 'Vande Bharat Exp',
    currentStation: 'Kanpur Central',
    speed: 155,
    direction: 'East',
    signalStatus: 'yellow',
    alertLevel: AlertPriority.MEDIUM,
    eta: '15:10',
    status: 'delayed',
  },
];

export const incidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Track Vibration Anomaly',
    location: 'KM 124, Sector 4, Zone B',
    timestamp: '2026-07-26T13:45:00Z',
    priority: AlertPriority.CRITICAL,
    status: 'investigating',
    assignedTeam: 'Maintenance Team 4',
    description: 'Autonomous sensors detected vertical vibration amplitude exceeding 12mm on high-speed corridor.',
    aiReasoning: 'Vibration frequency matches pattern associated with early-stage ballast instability. Nearby train speed (130km/h) is exacerbating the oscillation.',
    sensorReadings: [
      { label: 'Vertical Amplitude', value: '12.4mm', status: 'anomaly' },
      { label: 'Lateral Stress', value: '4.2kN', status: 'normal' },
      { label: 'Ballast Pressure', value: '180kPa', status: 'anomaly' },
    ]
  },
  {
    id: 'INC-2026-002',
    title: 'Signal Sync Failure',
    location: 'Nagpur West Approach',
    timestamp: '2026-07-26T13:10:00Z',
    priority: AlertPriority.HIGH,
    status: 'open',
    assignedTeam: 'S&T Division Alpha',
    description: 'Intermittent synchronization loss between electronic interlocking and signal post S-42.',
    aiReasoning: 'Possible electromagnetic interference or loose terminal connection in junction box JB-14.',
    sensorReadings: [
      { label: 'Packet Loss', value: '14%', status: 'anomaly' },
      { label: 'Voltage Level', value: '24.2V', status: 'normal' },
      { label: 'Sync Latency', value: '450ms', status: 'anomaly' },
    ]
  }
];
