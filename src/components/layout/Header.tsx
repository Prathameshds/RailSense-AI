/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Cloud, 
  User, 
  LogOut, 
  Menu,
  Activity,
  Loader2
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';
import { currentUser } from '@/mockData';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [locationData, setLocationData] = useState<{
    city: string;
    temp: number;
    loading: boolean;
  }>({
    city: 'New Delhi',
    temp: 28,
    loading: true
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch Weather using Open-Meteo (No API Key required)
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();
          
          // Fetch Location Name using Nominatim (OSM)
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
            headers: {
              'User-Agent': 'RailSenseAI-App'
            }
          });
          const geoData = await geoRes.json();
          
          const address = geoData.address || {};
          const city = address.city || 
                       address.town || 
                       address.village || 
                       address.city_district || 
                       address.suburb || 
                       address.municipality || 
                       address.county || 
                       address.state_district || 
                       'Current Location';

          setLocationData({
            city,
            temp: Math.round(weatherData.current_weather.temperature),
            loading: false
          });
        } catch (error) {
          console.error("Error fetching location/weather:", error);
          setLocationData(prev => ({ ...prev, loading: false }));
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setLocationData(prev => ({ ...prev, loading: false }));
      });
    } else {
      setLocationData(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">RailSense <span className="text-blue-600">AI</span></span>
        </div>
        <div className="hidden md:flex ml-8 max-w-sm w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search trains, stations, sensors..." 
            className="w-full bg-gray-50 border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-600">
          <div className="flex items-center gap-2">
            {locationData.loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <Cloud className="h-4 w-4 text-blue-400" />
            )}
            <span>
              {locationData.loading ? 'Locating...' : `${locationData.temp}°C • ${locationData.city}`}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "relative")}>
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-3 ml-2 pl-2 border-l">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
