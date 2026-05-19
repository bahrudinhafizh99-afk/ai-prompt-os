"use client";

import { useState, useEffect } from "react";
import { UserCircle, Plus, ChevronLeft, Save, Sparkles, Smile, Info, Palette, Loader2, Trash2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const personalityOptions = ["Luxury", "Cute", "Elegant", "Soft Spoken", "Confident", "Mysterious"];
const nicheOptions = ["Lifestyle", "Fashion", "Travel", "Fitness", "Anime"];

export default function CharacterStudio() {
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [characters, setCharacters] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "Female",
    age: "",
    personality: "Elegant",
    niche: "Lifestyle",
    hair_style: "",
    hair_color: "",
    fashion_style: "",
    body_type: "",
    description: ""
  });

  useEffect(() => {
    fetchCharacters();
  }, []);

  async function fetchCharacters() {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setFetching(false);
    }
  }

  const handleEnhance = () => {
    if (!formData.name) return alert("Please enter a character name first!");
    
    setEnhancing(true);
    
    // AI Enhancement Logic (Simulated intelligent generation based on personality & niche)
    setTimeout(() => {
      const p = formData.personality;
      const n = formData.niche;
      
      let enhancements: any = {};
      
      if (p === "Luxury") {
        enhancements = {
          hair_style: "Sleek straight or polished waves",
          hair_color: "Deep espresso with subtle golden highlights",
          fashion_style: "High-end designer couture, silk fabrics, minimalist jewelry",
          body_type: "Graceful and slender",
          description: `${formData.name} embodies pure sophistication. Her skin has a flawless porcelain finish with a subtle glow. She prefers neutral tones and clean lines that scream old-money aesthetic.`
        };
      } else if (p === "Mysterious") {
        enhancements = {
          hair_style: "Messy bob with bangs",
          hair_color: "Jet black or silver-ash",
          fashion_style: "Dark avant-garde, leather accents, oversized silhouettes",
          body_type: "Sharp and angular",
          description: `${formData.name} has an enigmatic presence. Piercing eyes that seem to hold secrets. Her visual style is a mix of techwear and noir cinema.`
        };
      } else if (p === "Cute") {
        enhancements = {
          hair_style: "Double pigtails or soft curls",
          hair_color: "Pastel pink or warm honey blonde",
          fashion_style: "Kawaii aesthetic, soft knits, vibrant accessories",
          body_type: "Petite and energetic",
          description: `${formData.name} is the heart of any scene. Radiant smile, expressive large eyes, and a wardrobe filled with soft textures and playful colors.`
        };
      } else {
        // Default / Elegant
        enhancements = {
          hair_style: "Long flowing waves",
          hair_color: "Natural chestnut brown",
          fashion_style: "Contemporary chic, versatile and trendy",
          body_type: "Athletic and toned",
          description: `${formData.name} represents a perfect balance of trend and timelessness. She has a natural, sun-kissed skin texture and an approachable yet professional vibe.`
        };
      }

      setFormData(prev => ({ ...prev, ...enhancements, age: prev.age || "22-25" }));
      setEnhancing(false);
    }, 1200);
  };

  const handleSave = async () => {
    if (!formData.name) return alert("Character Name is required!");
    
    try {
      setLoading(true);
      const { data, error } = await supabase.from('characters').insert([{ ...formData }]).select();

      if (error) {
        alert(`Save failed: ${error.message}`);
        return;
      }
      
      setIsCreating(false);
      fetchCharacters();
      setFormData({
        name: "", gender: "Female", age: "", personality: "Elegant", niche: "Lifestyle",
        hair_style: "", hair_color: "", fashion_style: "", body_type: "", description: ""
      });
    } catch (error: any) {
      alert("Unexpected error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this character?")) return;
    try {
      const { error } = await supabase.from('characters').delete().eq('id', id);
      if (error) throw error;
      fetchCharacters();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserCircle className={cn(isCreating ? "text-accent-blue" : "text-accent-pink")} /> 
            {isCreating ? "Create New Identity" : "Character Studio"}
          </h1>
          <p className="text-slate-400">
            {isCreating ? "Define the visual style and personality of your AI Influencer." : "Manage your AI influencer identity and consistency."}
          </p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-accent-pink hover:bg-accent-pink/90 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          >
            <Plus size={20} /> Create Character
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-card border border-border rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 space-y-10">
            {/* Header with AI Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-border">
               <div>
                 <h3 className="font-bold flex items-center gap-2"><Sparkles className="text-amber-400" size={18} /> Neural Enhancer</h3>
                 <p className="text-xs text-slate-500">Auto-generate professional visual specs based on personality.</p>
               </div>
               <button 
                onClick={handleEnhance}
                disabled={enhancing}
                className="flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50"
               >
                 {enhancing ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                 {enhancing ? "Processing..." : "AI Auto-Fill Details"}
               </button>
            </div>

            {/* Basic Info */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Info size={16} /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Character Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Maya AI" 
                    className="w-full bg-slate-800/30 border border-border rounded-xl px-4 py-3 outline-none focus:neon-border-blue transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-slate-800/30 border border-border rounded-xl px-4 py-3 outline-none focus:neon-border-blue transition-all appearance-none"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Age Range</label>
                  <input 
                    type="text" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="e.g. 20-25" 
                    className="w-full bg-slate-800/30 border border-border rounded-xl px-4 py-3 outline-none focus:neon-border-blue transition-all" 
                  />
                </div>
              </div>
            </section>

            {/* Personality & Niche */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Smile size={16} /> Personality & Niche
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400">Personality Type</label>
                  <div className="flex flex-wrap gap-2">
                    {personalityOptions.map(opt => (
                      <button 
                        key={opt} 
                        onClick={() => setFormData({...formData, personality: opt})}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs transition-all",
                          formData.personality === opt ? "bg-accent-purple/20 border-accent-purple text-accent-purple" : "border-border hover:border-slate-600"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400">Content Niche</label>
                  <div className="flex flex-wrap gap-2">
                    {nicheOptions.map(opt => (
                      <button 
                        key={opt} 
                        onClick={() => setFormData({...formData, niche: opt})}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs transition-all",
                          formData.niche === opt ? "bg-accent-blue/20 border-accent-blue text-accent-blue" : "border-border hover:border-slate-600"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Visual Specs */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Palette size={16} /> Visual Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Hair Style</label>
                  <input 
                    type="text" 
                    value={formData.hair_style}
                    onChange={(e) => setFormData({...formData, hair_style: e.target.value})}
                    placeholder="e.g. Long wavy" 
                    className="w-full bg-slate-800/30 border border-border rounded-xl px-4 py-3 outline-none focus:neon-border-blue transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Hair Color</label>
                  <input 
                    type="text" 
                    value={formData.hair_color}
                    onChange={(e) => setFormData({...formData, hair_color: e.target.value})}
                    placeholder="e.g. Platinum blonde" 
                    className="w-full bg-slate-800/30 border border-border rounded-xl px-4 py-3 outline-none focus:neon-border-blue transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Fashion Style</label>
                  <input 
                    type="text" 
                    value={formData.fashion_style}
                    onChange={(e) => setFormData({...formData, fashion_style: e.target.value})}
                    placeholder="e.g. Streetwear luxury" 
                    className="w-full bg-slate-800/30 border border-border rounded-xl px-4 py-3 outline-none focus:neon-border-blue transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Body Type</label>
                  <input 
                    type="text" 
                    value={formData.body_type}
                    onChange={(e) => setFormData({...formData, body_type: e.target.value})}
                    placeholder="e.g. Athletic" 
                    className="w-full bg-slate-800/30 border border-border rounded-xl px-4 py-3 outline-none focus:neon-border-blue transition-all" 
                  />
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-4">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} /> Detailed Identity Description
              </label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe her backstory, specific facial features, and unique traits for better AI consistency..."
                className="w-full bg-slate-800/30 border border-border rounded-2xl p-6 min-h-[150px] outline-none focus:neon-border-pink transition-all"
              ></textarea>
            </section>
          </div>

          <div className="p-8 bg-slate-900/50 border-t border-border flex justify-between">
            <button 
              onClick={() => setIsCreating(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-accent-blue text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {loading ? "Saving..." : "Save Identity"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => setIsCreating(true)}
            className="bg-card border border-dashed border-slate-700 p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:border-accent-pink transition-colors h-full"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="text-slate-500 group-hover:text-accent-pink" size={32} />
            </div>
            <div>
              <h3 className="font-bold">Add New Identity</h3>
              <p className="text-xs text-slate-500">Define visual style & personality</p>
            </div>
          </div>

          {fetching ? (
            <div className="col-span-1 md:col-span-2 flex justify-center py-20">
              <Loader2 className="animate-spin text-accent-blue" size={40} />
            </div>
          ) : characters.map((char) => (
            <div key={char.id} className="bg-card border border-border p-6 rounded-3xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(char.id)} className="text-slate-500 hover:text-red-400 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple font-bold">
                    {char.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold">{char.name}</h3>
                    <p className="text-xs text-slate-500">{char.niche} • {char.personality}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono uppercase">
                  <div className="bg-slate-800/50 px-2 py-1 rounded truncate">{char.hair_color}</div>
                  <div className="bg-slate-800/50 px-2 py-1 rounded truncate">{char.fashion_style}</div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 italic">"{char.description || 'No description provided.'}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
