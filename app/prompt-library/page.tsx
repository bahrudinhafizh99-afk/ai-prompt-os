"use client";

import { useState, useEffect } from "react";
import { 
  Library, 
  Search, 
  Copy, 
  Trash2, 
  Loader2, 
  Calendar,
  Check,
  Tag,
  Filter,
  Monitor,
  Layout,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copyId, setCopyId] = useState<string | null>(null);
  
  // Filter states
  const [activePlatform, setActivePlatform] = useState<string>("All");
  const [activeType, setActiveType] = useState<string>("All");

  useEffect(() => {
    fetchPrompts();
  }, []);

  async function fetchPrompts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPrompts(data || []);
    } catch (e) {
      console.error("Error fetching prompts:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopyId(id);
    setTimeout(() => setCopyId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prompt from library?")) return;
    try {
      const { error } = await supabase.from('prompts').delete().eq('id', id);
      if (error) throw error;
      fetchPrompts();
    } catch (e) {
      alert("Delete failed.");
    }
  };

  // Get unique platforms and types for filters
  const platforms = ["All", ...Array.from(new Set(prompts.filter(p => p.platform).map(p => p.platform)))];
  const types = ["All", ...Array.from(new Set(prompts.map(p => p.prompt_type)))];

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt_type.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags && p.tags.toLowerCase().includes(search.toLowerCase())) ||
      p.environment?.toLowerCase().includes(search.toLowerCase());
    
    const matchesPlatform = activePlatform === "All" || p.platform === activePlatform;
    const matchesType = activeType === "All" || p.prompt_type === activeType;

    return matchesSearch && matchesPlatform && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Library className="text-accent-blue" /> Prompt Library
          </h1>
          <p className="text-slate-400">Manage and organize your cinematic directions.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by text or tags..." 
              className="w-full bg-slate-800/50 border border-border pl-12 pr-6 py-3 rounded-full outline-none focus:neon-border-blue transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card/30 border border-border p-4 rounded-2xl flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Filter size={14} /> Quick Filters:
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
            <Layout size={14} className="text-slate-600" />
            {types.slice(0, 5).map(type => (
              <button 
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeType === type ? "bg-accent-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pl-2">
            <Monitor size={14} className="text-slate-600" />
            {platforms.slice(0, 5).map(plat => (
              <button 
                key={plat}
                onClick={() => setActivePlatform(plat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activePlatform === plat ? "bg-accent-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent-blue" size={40} />
        </div>
      ) : filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredPrompts.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-3xl overflow-hidden hover:border-slate-700 transition-all group">
              <div className="flex flex-col md:flex-row min-h-[220px]">
                {/* Visual Thumbnail (New) */}
                <div className="w-full md:w-48 bg-slate-900 flex-shrink-0 relative overflow-hidden group-hover:bg-slate-800 transition-colors">
                  {p.reference_url ? (
                    <img 
                      src={p.reference_url} 
                      alt="Ref" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                      onError={(e) => { (e.target as any).style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 gap-2 p-4 text-center">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No Visual Ref</span>
                    </div>
                  )}
                  {p.reference_url && (
                    <a href={p.reference_url} target="_blank" className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                      <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full border border-accent-blue/20">
                        {p.prompt_type}
                      </span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full flex items-center gap-1">
                        <Calendar size={10} /> {new Date(p.created_at).toLocaleDateString()}
                      </span>
                      {p.tags && (
                        <span className="px-3 py-1 bg-accent-pink/10 text-accent-pink rounded-full border border-accent-pink/20 flex items-center gap-1">
                          <Tag size={10} /> {p.tags}
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 max-h-32 overflow-y-auto scrollbar-hide">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-slate-400 leading-relaxed">
                        {p.content}
                      </pre>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 italic">
                      {p.environment && <span>• {p.environment}</span>}
                      {p.mood && <span>• {p.mood}</span>}
                      {p.platform && <span>• Target: {p.platform}</span>}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 justify-end">
                    <button 
                      onClick={() => handleCopy(p.content, p.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full md:w-40",
                        copyId === p.id ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-white text-black hover:scale-105"
                      )}
                    >
                      {copyId === p.id ? <Check size={16} /> : <Copy size={16} />}
                      {copyId === p.id ? "Copied" : "Copy"}
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-800/50 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full md:w-40"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
            <Library className="text-slate-600" size={40} />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-xl font-bold">No Prompts Found</h3>
            <p className="text-slate-500 text-sm">
              {search || activePlatform !== "All" || activeType !== "All" 
                ? "No results matching your filters." 
                : "Save your generated prompts to access them quickly later."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
