"use client";

import { usePromptStore } from "@/store/usePromptStore";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  ChevronRight, 
  MapPin, 
  Sun, 
  Camera, 
  Layout, 
  MessageCircle,
  Sparkles,
  UserCircle,
  Loader2,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const options = {
  promptType: ["Image Prompt", "Video Prompt", "TikTok Cinematic", "POV Scene", "Instagram Photo"],
  environment: ["Luxury Cafe", "Tokyo Street", "Beach", "Apartment", "Gym", "Night City"],
  mood: ["Elegant", "Romantic", "Luxury", "Confident", "Relaxed"],
  lighting: ["Golden Hour", "Natural Light", "Soft Light", "Neon", "Dark Cinematic"],
  cameraStyle: ["Close Up", "Tracking Shot", "Drone Shot", "POV", "Portrait"],
  platform: ["TikTok", "Instagram", "YouTube Shorts"],
};

const presets = [
  {
    name: "Cyberpunk Night",
    icon: "🌃",
    config: {
      environment: "Night City",
      mood: "Confident",
      lighting: "Neon",
      cameraStyle: "Tracking Shot",
      promptType: "Video Prompt"
    }
  },
  {
    name: "Luxury Travel",
    icon: "💎",
    config: {
      environment: "Luxury Cafe",
      mood: "Luxury",
      lighting: "Golden Hour",
      cameraStyle: "Portrait",
      promptType: "Instagram Photo"
    }
  },
  {
    name: "Tokyo Street",
    icon: "🇯🇵",
    config: {
      environment: "Tokyo Street",
      mood: "Elegant",
      lighting: "Soft Light",
      cameraStyle: "Tracking Shot",
      promptType: "TikTok Cinematic"
    }
  },
  {
    name: "Minimal Studio",
    icon: "📸",
    config: {
      environment: "Apartment",
      mood: "Relaxed",
      lighting: "Natural Light",
      cameraStyle: "Close Up",
      promptType: "Image Prompt"
    }
  }
];

export default function PromptBuilder() {
  const router = useRouter();
  const { setField, ...state } = usePromptStore();
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const { data, error } = await supabase.from('characters').select('*').order('name');
        if (error) throw error;
        setCharacters(data || []);
      } catch (e) {
        console.error("Failed to fetch characters:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, []);

  const applyPreset = (config: any) => {
    Object.keys(config).forEach((key) => {
      setField(key as any, config[key]);
    });
  };

  const handleNext = () => {
    router.push("/motion-control");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Zap className="text-accent-blue" fill="currentColor" /> Prompt Builder
        </h1>
        <p className="text-slate-400 font-medium">Phase 1: Scene & Atmosphere</p>
      </div>

      {/* Cinematic Presets (New) */}
      <section className="space-y-4">
        <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
          <Filter size={16} /> Cinematic Presets
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.config)}
              className="bg-card border border-border p-4 rounded-2xl hover:neon-border-blue transition-all group text-left"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{preset.icon}</div>
              <p className="text-xs font-bold text-slate-300">{preset.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Character Selection */}
      <section className="space-y-4 bg-card/50 border border-border p-6 rounded-3xl">
        <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
          <UserCircle size={16} /> Select Character Identity
        </label>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setField("character", "Default Character")}
            className={cn(
              "flex-shrink-0 px-6 py-3 rounded-xl border transition-all text-sm font-bold",
              state.character === "Default Character" 
                ? "bg-accent-pink/10 border-accent-pink text-accent-pink shadow-[0_0_10px_rgba(236,72,153,0.2)]" 
                : "bg-slate-800/20 border-border text-slate-500 hover:border-slate-600"
            )}
          >
            No Character
          </button>
          
          {loading ? (
            <div className="flex items-center px-4">
              <Loader2 className="animate-spin text-slate-600" size={20} />
            </div>
          ) : (
            characters.map(char => (
              <button 
                key={char.id}
                onClick={() => setField("character", char.name)}
                className={cn(
                  "flex-shrink-0 px-6 py-3 rounded-xl border transition-all text-sm font-bold",
                  state.character === char.name 
                    ? "bg-accent-pink/10 border-accent-pink text-accent-pink shadow-[0_0_10px_rgba(236,72,153,0.2)]" 
                    : "bg-slate-800/20 border-border text-slate-500 hover:border-slate-600"
                )}
              >
                {char.name}
              </button>
            ))
          )}
          
          <button 
            onClick={() => router.push("/character-studio")}
            className="flex-shrink-0 px-6 py-3 rounded-xl border border-dashed border-slate-700 text-slate-500 hover:border-accent-pink hover:text-accent-pink transition-all text-sm font-bold flex items-center gap-2"
          >
            <Plus size={16} /> New
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prompt Type */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Layout size={16} /> Prompt Type
          </label>
          <div className="grid grid-cols-1 gap-2">
            {options.promptType.map((type) => (
              <button
                key={type}
                onClick={() => setField("promptType", type)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all",
                  state.promptType === type 
                    ? "bg-accent-blue/10 border-accent-blue text-accent-blue font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Environment */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <MapPin size={16} /> Environment
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.environment.map((env) => (
              <button
                key={env}
                onClick={() => setField("environment", env)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.environment === env 
                    ? "bg-accent-purple/10 border-accent-purple text-accent-purple font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {env}
              </button>
            ))}
          </div>
        </section>

        {/* Mood */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Sparkles size={16} /> Mood
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.mood.map((mood) => (
              <button
                key={mood}
                onClick={() => setField("mood", mood)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.mood === mood 
                    ? "bg-accent-pink/10 border-accent-pink text-accent-pink font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {mood}
              </button>
            ))}
          </div>
        </section>

        {/* Lighting */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Sun size={16} /> Lighting
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.lighting.map((light) => (
              <button
                key={light}
                onClick={() => setField("lighting", light)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.lighting === light 
                    ? "bg-amber-400/10 border-amber-400 text-amber-400 font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {light}
              </button>
            ))}
          </div>
        </section>

        {/* Camera Style */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Camera size={16} /> Camera Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.cameraStyle.map((camera) => (
              <button
                key={camera}
                onClick={() => setField("cameraStyle", camera)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.cameraStyle === camera 
                    ? "bg-emerald-400/10 border-emerald-400 text-emerald-400 font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {camera}
              </button>
            ))}
          </div>
        </section>

        {/* Platform */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <MessageCircle size={16} /> Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.platform.map((p) => (
              <button
                key={p}
                onClick={() => setField("platform", p)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.platform === p 
                    ? "bg-accent-blue/10 border-accent-blue text-accent-blue font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl"
        >
          Next: Motion Control <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
