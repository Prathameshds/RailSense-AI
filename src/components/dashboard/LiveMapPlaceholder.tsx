/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map as MapIcon, Maximize2, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LiveMapPlaceholder() {
  return (
    <Card className="h-full border-gray-200/60 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      <CardHeader className="p-5 pb-2 border-b bg-white z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-blue-600" />
            Live Railway Operations Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
              Live Feed
            </Badge>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 relative bg-slate-50">
        {/* Placeholder for actual Mapbox/Leaflet integration */}
        <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/identicon/svg?seed=railmap')] opacity-5 mix-blend-multiply" />
        
        {/* Mock Map Grid and Path */}
        <svg className="absolute inset-0 w-full h-full text-blue-100/30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main Line */}
          <path d="M 50,50 L 200,150 L 400,100 L 600,300" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="8 4" strokeLinecap="round" opacity="0.4" />
          
          {/* Train Indicators */}
          <circle cx="200" cy="150" r="8" fill="#2563EB" className="animate-pulse" />
          <circle cx="400" cy="100" r="8" fill="#F59E0B" />
          <circle cx="600" cy="300" r="8" fill="#16A34A" />
        </svg>

        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button variant="secondary" size="icon" className="shadow-lg bg-white">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="shadow-lg bg-white">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 shadow-sm text-xs space-y-2">
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="font-medium text-gray-700">Passenger Express</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-600" />
              <span className="font-medium text-gray-700">Freight Corridor</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-medium text-gray-700 font-bold">Active Incident</span>
           </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-100 shadow-xl flex items-center gap-3">
              <MapIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-bold text-gray-800 tracking-tight uppercase">GIS Mapping Engine Initializing...</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
