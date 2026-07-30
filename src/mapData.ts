/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrainStatus } from './types';

export interface TrainLocation {
  id: string;
  name: string;
  number: string;
  lat: number;
  lng: number;
  speed: number;
  bearing: number;
  typeCode: number;
  delay: number;
  lastStation: string;
  nextStation: string;
  distFromLast: number;
  distToNext: number;
  status: TrainStatus;
  lastUpdated: string;
  route: { lat: number; lng: number }[];
  progress: number; // 0 to 1
}

export const STATION_COORDINATES = {
  NDLS: { lat: 28.6139, lng: 77.2090, name: 'New Delhi' },
  MMCT: { lat: 19.0760, lng: 72.8777, name: 'Mumbai Central' },
  SBC: { lat: 12.9716, lng: 77.5946, name: 'KSR Bengaluru' },
  HWH: { lat: 22.5726, lng: 88.3639, name: 'Howrah' },
  MAS: { lat: 13.0827, lng: 80.2707, name: 'Chennai Central' },
};

export const MOCK_ROUTES = {
  DELHI_MUMBAI: [
    STATION_COORDINATES.NDLS,
    { lat: 26.9124, lng: 75.7873 }, // Jaipur
    { lat: 24.5854, lng: 73.7125 }, // Udaipur
    { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
    STATION_COORDINATES.MMCT,
  ],
  DELHI_KOLKATA: [
    STATION_COORDINATES.NDLS,
    { lat: 26.4499, lng: 80.3319 }, // Kanpur
    { lat: 25.4358, lng: 81.8463 }, // Prayagraj
    { lat: 25.3176, lng: 82.9739 }, // Varanasi
    STATION_COORDINATES.HWH,
  ],
};
