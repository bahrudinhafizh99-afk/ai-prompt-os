"use client";

import { usePromptStore } from "@/store/usePromptStore";
import { useRouter } from "next/navigation";
import { 
  Move3d, 
  ChevronRight, 
  ChevronLeft,
  Camera,
  User,
  Zap,
  Film
} from "lucide-react";
import { cn } from "@/lib/utils";

const options = {
  cameraMotion: ["Pan Left", "Pan Right", "Tilt Up", "Tracking Shot", "Orbit Shot", "Handheld Camera"],
  humanMotion: ["Walking", "Hair Movement", "Eye Contact", "Head Turn", "Natural Breathing"],
  motionIntensity: ["Low", "Medium", "High"] as const,
  realismStyle: ["Netflix Documentary", "TikTok Vlog", "Luxury Film", "Movie Cinematic"],
};

export default function MotionControl() {
  const router = useRouter();
  const { setField, ...state } = usePromptStore();

  const handleGenerate = () => {
    router.push("/prompt-result");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Move3d className="text-accent-purple" /> Motion Control
        </h1>
        <p className="text-slate-400 font-medium">Phase 2: Movement & Realism</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Camera Motion */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Camera size={16} /> Camera Motion
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.cameraMotion.map((motion) => (
              <button
                key={motion}
                onClick={() => setField("cameraMotion", motion)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.cameraMotion === motion 
                    ? "bg-accent-blue/10 border-accent-blue text-accent-blue font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {motion}
              </button>
            ))}
          </div>
        </section>

        {/* Human Motion */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <User size={16} /> Human Motion
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.humanMotion.map((motion) => (
              <button
                key={motion}
                onClick={() => setField("humanMotion", motion)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.humanMotion === motion 
                    ? "bg-accent-pink/10 border-accent-pink text-accent-pink font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {motion}
              </button>
            ))}
          </div>
        </section>

        {/* Motion Intensity */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Zap size={16} /> Motion Intensity
          </label>
          <div className="flex gap-2">
            {options.motionIntensity.map((intensity) => (
              <button
                key={intensity}
                onClick={() => setField("motionIntensity", intensity)}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl border text-center transition-all text-sm font-bold",
                  state.motionIntensity === intensity 
                    ? "bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {intensity}
              </button>
            ))}
          </div>
        </section>

        {/* Realism Style */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
            <Film size={16} /> Realism Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.realismStyle.map((style) => (
              <button
                key={style}
                onClick={() => setField("realismStyle", style)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  state.realismStyle === style 
                    ? "bg-accent-purple/10 border-accent-purple text-accent-purple font-bold" 
                    : "bg-slate-800/20 border-border text-slate-400 hover:border-slate-600"
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-between pt-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-700 transition-all"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button 
          onClick={handleGenerate}
          className="flex items-center gap-2 bg-accent-blue text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
        >
          Generate Master Prompt <Zap size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
