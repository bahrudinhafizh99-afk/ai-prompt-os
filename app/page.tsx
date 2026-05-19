"use client";

import { 
  Plus, 
  Video, 
  Image as ImageIcon, 
  Zap, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  FileText,
  Users,
  Clock,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const quickActions = [
  { name: "Create Image Prompt", icon: ImageIcon, color: "text-accent-blue", href: "/prompt-builder" },
  { name: "Create Video Prompt", icon: Video, color: "text-accent-purple", href: "/prompt-builder" },
  { name: "Motion Prompt", icon: Zap, color: "text-accent-pink", href: "/motion-control" },
  { name: "Character Studio", icon: Users, color: "text-emerald-400", href: "/character-studio" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ characters: 0, prompts: 0 });
  const [recentPrompts, setRecentPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch counts
        const { count: charCount } = await supabase.from('characters').select('*', { count: 'exact', head: true });
        const { count: promptCount } = await supabase.from('prompts').select('*', { count: 'exact', head: true });
        
        setStats({ 
          characters: charCount || 0, 
          prompts: promptCount || 0 
        });

        // Fetch recent prompts
        const { data: recent } = await supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        setRecentPrompts(recent || []);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-[10px] md:text-sm font-semibold text-accent-blue tracking-widest uppercase">System Online</h2>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome, <span className="glow-text-blue">Creator</span></h1>
          <p className="text-sm md:text-base text-slate-400">Ready to direct your next cinematic masterpiece?</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link href="/prompt-builder" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm md:text-base">
            <Plus size={18} className="md:w-5 md:h-5" /> New Project
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-card border border-border p-4 md:p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-slate-800 opacity-20 group-hover:scale-110 transition-transform hidden md:block">
            <Users size={80} />
          </div>
          <p className="text-slate-500 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Active Identities</p>
          <p className="text-2xl md:text-3xl font-bold">{loading ? "..." : stats.characters}</p>
        </div>
        <div className="bg-card border border-border p-4 md:p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-slate-800 opacity-20 group-hover:scale-110 transition-transform hidden md:block">
            <FileText size={80} />
          </div>
          <p className="text-slate-500 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Stored Prompts</p>
          <p className="text-2xl md:text-3xl font-bold">{loading ? "..." : stats.prompts}</p>
        </div>
        
        {quickActions.slice(0, 2).map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.name} href={action.href} className="bg-card border border-border p-4 md:p-6 rounded-2xl hover:neon-border-blue transition-all group relative overflow-hidden">
               <div className="relative z-10">
                <div className={`p-2 md:p-3 rounded-xl bg-slate-800/50 w-fit mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={action.color} size={20} />
                </div>
                <h3 className="font-bold text-xs md:text-sm mb-1">{action.name}</h3>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-accent-blue transition-colors">
                  Launch <ArrowRight size={10} />
                </p>
               </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Prompts List */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Clock size={18} className="text-accent-pink md:w-5 md:h-5" /> Recent Library Activity
            </h3>
            <Link href="/prompt-library" className="text-xs md:text-sm text-slate-500 hover:text-white transition-colors">View All</Link>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {loading ? (
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-accent-blue" size={24} />
                <p className="text-slate-500 text-xs md:text-sm">Neural sync...</p>
              </div>
            ) : recentPrompts.length > 0 ? (
              recentPrompts.map((p) => (
                <Link href="/prompt-library" key={p.id} className="block bg-card border border-border p-4 md:p-5 rounded-2xl hover:border-accent-blue/50 transition-all group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 min-w-0">
                      <p className="text-[8px] md:text-[10px] font-bold text-accent-blue uppercase tracking-widest">{p.prompt_type} • {new Date(p.created_at).toLocaleDateString()}</p>
                      <p className="text-xs md:text-sm text-slate-300 truncate italic group-hover:text-white transition-colors">"{p.content.split('\n')[0].replace('### ', '')}..."</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-accent-blue transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="text-slate-600" size={24} />
                </div>
                <p className="text-slate-500 text-xs md:text-sm">Neural database empty.</p>
                <Link href="/prompt-builder" className="inline-block text-accent-purple font-medium hover:underline text-xs md:text-sm">Initialize first prompt</Link>
              </div>
            )}
          </div>
        </div>

        {/* Inspiration / System News */}
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400 md:w-5 md:h-5" /> Inspiration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-gradient-to-br from-accent-purple/20 to-accent-blue/10 border border-accent-purple/20 p-4 md:p-5 rounded-2xl">
              <h4 className="font-bold text-xs md:text-sm mb-2 uppercase tracking-tight">Pro Tip: Studio</h4>
              <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">
                Defining hair style and fashion in Character Studio automatically injects consistency layers.
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-800 p-4 md:p-5 rounded-2xl">
              <h4 className="font-bold text-xs md:text-sm mb-2 text-accent-pink uppercase tracking-tight">Motion Mastery</h4>
              <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">
                Use "Handheld" camera with "Walking" motion for realistic TikTok results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
