/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  RAILWAY_ADMIN = 'Railway Administrator',
  CONTROL_ROOM_OPERATOR = 'Control Room Operator',
  STATION_MASTER = 'Station Master',
  MAINTENANCE_ENGINEER = 'Maintenance Engineer',
  TRAIN_DRIVER = 'Train Driver',
  DATA_ANALYST = 'Data Analyst',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface KPIData {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Alert {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  priority: AlertPriority;
  confidence: number;
  status: 'active' | 'resolved' | 'investigating';
  description: string;
}

export enum TrainStatus {
  ON_TIME = 'on-time',
  DELAYED = 'delayed',
  STOPPED = 'stopped',
}

export interface Train {
  id: string;
  number: string;
  name: string;
  currentStation: string;
  speed: number;
  direction: string;
  signalStatus: 'green' | 'yellow' | 'orange' | 'red';
  alertLevel: AlertPriority;
  eta: string;
  status: 'on-time' | 'delayed' | 'stopped';
  driver?: string;
  capacity?: number;
  load?: number;
  lastMaintenance?: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  rainfall: number;
  rainProb: number;
  windSpeed: number;
  windDir: string;
  visibility: number;
  condition: string;
  icon: string;
}

export interface WeatherRisk {
  id: string;
  type: 'FLOOD' | 'VISIBILITY' | 'EXPANSION' | 'WIND' | 'ELECTRICAL' | 'STORM';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  action: string;
  probability: number;
}

export interface WeatherLocation {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  weather: WeatherData;
  risks: WeatherRisk[];
  signalStatus: 'PROCEED' | 'PROCEED_CAUTION' | 'CAUTION' | 'STOP_RESTRICTED' | 'STOP';
  safetyRecommendation: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  priority: AlertPriority;
  time: string;
  location: string;
  description: string;
  action: string;
  affectedTrack: string;
}

export interface PanIndiaWeatherIntel {
  locations: WeatherLocation[];
  globalAlerts: WeatherAlert[];
  lastUpdated: string;
}

export interface Incident {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  priority: AlertPriority;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTeam: string;
  description: string;
  aiReasoning: string;
  sensorReadings: {
    label: string;
    value: string;
    status: 'normal' | 'anomaly';
  }[];
}
