"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/components/AuthProvider";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          <div className="flex min-h-screen relative overflow-x-hidden">
            {/* Mobile Menu Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar Container */}
            <div className={`
              fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
              {/* Mobile Header */}
              <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
                <h1 className="text-lg font-bold glow-text-blue tracking-tighter uppercase italic">
                  AI Prompt <span className="text-accent-purple">OS</span>
                </h1>
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </header>

              <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
