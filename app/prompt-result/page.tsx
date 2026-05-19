"use client";

import { usePromptStore } from "@/store/usePromptStore";
import { useRouter } from "next/navigation";
import { 
  Copy, 
  ExternalLink, 
  Check,
  Sparkles,
  ArrowLeft,
  Save,
  Loader2,
  Cpu,
  Monitor,
  Tag,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";

export default function PromptResult() {
  const router = useRouter();
  const { user } = useAuth();
  const { generateMasterPrompt, setField, ...state } = usePromptStore();
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [customGptUrl, setCustomGptUrl] = useState("https://chatgpt.com/g/g-your-custom-gpt-id");

  useEffect(() => {
    setPrompt(generateMasterPrompt());
    
    // Load custom GPT URL from settings
    const savedUrl = localStorage.getItem("ai_prompt_os_gpt_url");
    if (savedUrl) {
      setCustomGptUrl(savedUrl);
    }
  }, [generateMasterPrompt, state.targetPlatform]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = async () => {
    if (!user) return alert("You must be logged in to save.");
    
    try {
      setSaving(true);
      const { error } = await supabase.from('prompts').insert([
        {
          user_id: user.id,
          prompt_type: state.promptType,
          content: prompt,
          environment: state.environment,
          mood: state.mood,
          lighting: state.lighting,
          camera_style: state.cameraStyle,
          motion_style: state.cameraMotion,
          platform: state.platform,
          tags: state.tags,
          reference_url: state.referenceUrl
        }
      ]);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      alert(error.message || "Failed to save to library.");
    } finally {
      setSaving(false);
    }
  };

  const openGPT = () => {
    window.open(customGptUrl, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="text-accent-pink" /> Master GPT Prompt
          </h1>
          <p className="text-slate-400 font-medium">Your cinematic direction is ready.</p>
        </div>
        <button 
          onClick={() => router.push("/prompt-builder")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Edit Scene
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Tags */}
        <section className="bg-slate-900/50 border border-border p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Tag size={14} /> Project Tags
          </div>
          <input 
            type="text"
            value={state.tags}
            onChange={(e) => setField('tags', e.target.value)}
            placeholder="e.g. Client A, TikTok Series"
            className="w-full bg-slate-800/20 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:neon-border-purple transition-all"
          />
        </section>

        {/* Visual Reference (New) */}
        <section className="bg-slate-900/50 border border-border p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <LinkIcon size={14} /> Reference Image URL (Pinterest/Unsplash)
          </div>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              type="text"
              value={state.referenceUrl}
              onChange={(e) => setField('referenceUrl', e.target.value)}
              placeholder="Paste image link here..."
              className="w-full bg-slate-800/20 border border-border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:neon-border-blue transition-all font-mono"
            />
          </div>
        </section>
      </div>

      {/* Platform Optimization */}
      <section className="bg-slate-900/50 border border-border p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Cpu size={14} /> Optimize for Specific Engine
        </div>
        <div className="flex flex-wrap gap-2">
          {(['Generic', 'Kling', 'Runway', 'Luma'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setField('targetPlatform', p)}
              className={cn(
                "px-6 py-2 rounded-xl border text-xs font-bold transition-all",
                state.targetPlatform === p 
                  ? "bg-accent-blue/10 border-accent-blue text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                  : "bg-slate-800/20 border-border text-slate-500 hover:border-slate-600"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-card border border-border rounded-3xl p-8 space-y-6">
          <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-6 rounded-2xl border border-slate-800 max-h-[400px] overflow-y-auto scrollbar-hide">
            {prompt}
          </pre>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-full font-bold hover:scale-105 transition-all"
            >
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              {copied ? "Copied!" : "Copy Master Prompt"}
            </button>
            <button 
              onClick={handleSaveToLibrary}
              disabled={saving}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 border px-6 py-4 rounded-full font-bold transition-all",
                saved 
                  ? "bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                  : "bg-slate-800/50 border-border text-white hover:border-accent-purple"
              )}
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : (saved ? <Check size={20} /> : <Save size={20} />)}
              {saving ? "Saving..." : (saved ? "Saved to Library" : "Save to Library")}
            </button>
            <button 
              onClick={openGPT}
              className="flex-1 flex items-center justify-center gap-2 bg-accent-blue text-white px-6 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
            >
              <ExternalLink size={20} /> Open GPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
