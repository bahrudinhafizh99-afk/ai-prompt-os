"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
  Zap, 
  Move3d, 
  FileText, 
  Library, 
  Settings,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Character Studio", icon: UserCircle, href: "/character-studio" },
  { name: "Prompt Builder", icon: Zap, href: "/prompt-builder" },
  { name: "Motion Control", icon: Move3d, href: "/motion-control" },
  { name: "Prompt Library", icon: Library, href: "/prompt-library" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Don't show sidebar on login page
  if (pathname === "/login") return null;

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold glow-text-blue tracking-tighter uppercase italic">
          AI Prompt <span className="text-accent-purple">OS</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-accent-blue/10 text-accent-blue neon-border-blue" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-accent-blue" : "group-hover:text-slate-200")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
              <User size={16} className="text-accent-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">
                {user.email}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                Director
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span>Exit Terminal</span>
        </button>

        <div className="bg-slate-800/50 p-3 rounded-xl text-[10px] text-slate-600 text-center uppercase tracking-widest">
          v1.0.0 MVP
        </div>
      </div>
    </div>
  );
}
