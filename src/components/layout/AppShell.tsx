/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Timeline from "./Timeline";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 font-sans selection:bg-blue-100">
      <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
              >
                <Sidebar collapsed={false} setCollapsed={() => {}} className="h-full border-none" />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          className="hidden lg:flex sticky top-16 h-[calc(100vh-64px)]"
        />

        {/* System Timeline - Moved to left side */}
        <aside className="hidden xl:flex w-80 bg-white border-r flex-col h-[calc(100vh-64px)] sticky top-16 order-first xl:order-none">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-sm">System Timeline</h3>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <ScrollArea className="flex-1">
             <div className="p-6">
                <Timeline />
             </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
              {children}
            </div>
            
            <footer className="mt-auto px-6 py-4 border-t bg-white/50 text-center text-xs text-gray-400">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© 2026 RailSense AI — Indian Railways Operations & Safety. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    System Status: Operational
                  </span>
                  <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                </div>
              </div>
            </footer>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
