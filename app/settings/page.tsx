"use client";

import { useState, useEffect } from "react";
import { Settings, Globe, Shield, Save, Check, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [gptUrl, setGptUrl] = useState("https://chatgpt.com/g/g-your-custom-gpt-id");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved URL on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("ai_prompt_os_gpt_url");
    if (savedUrl) {
      setGptUrl(savedUrl);
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    // Simulate slight delay for "futuristic" feel
    setTimeout(() => {
      localStorage.setItem("ai_prompt_os_gpt_url", gptUrl);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="text-slate-400" /> Settings
        </h1>
        <p className="text-slate-400">Configure your system preferences and integrations.</p>
      </div>

      <div className="space-y-6">
        {/* GPT Configuration */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-border bg-slate-800/30 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Globe size={18} className="text-accent-blue" /> GPT Custom Configuration
            </h3>
            <span className="text-[10px] bg-accent-blue/10 text-accent-blue px-2 py-1 rounded-full font-bold uppercase tracking-widest">Integration</span>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                GPT Custom Director URL
                <span className="text-slate-600 font-normal normal-case">Link to your specific GPT workflow</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={gptUrl}
                  onChange={(e) => setGptUrl(e.target.value)}
                  placeholder="https://chatgpt.com/g/g-..."
                  className="flex-1 bg-slate-900/50 border border-border px-5 py-4 rounded-2xl outline-none focus:neon-border-blue transition-all font-mono text-sm text-accent-blue"
                />
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className={cn(
                    "px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                    saved 
                      ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                      : "bg-white text-black hover:scale-105"
                  )}
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : (saved ? <Check size={20} /> : <Save size={20} />)}
                  {saving ? "Updating..." : (saved ? "Saved!" : "Update URL")}
                </button>
              </div>
              <p className="text-xs text-slate-500 italic">
                This URL will be used globally for the "Open GPT" button in your results.
              </p>
            </div>
          </div>
        </section>

        {/* Account Info (Mockup) */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden opacity-60 grayscale group">
          <div className="p-6 border-b border-border bg-slate-800/30">
            <h3 className="font-bold flex items-center gap-2">
              <Shield size={18} className="text-accent-purple" /> User Profile & Identity
            </h3>
          </div>
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto flex items-center justify-center">
              <Shield className="text-slate-600" size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold">Encrypted Workspace</h4>
              <p className="text-xs text-slate-500">Authentication features arriving in the next system update (v1.1).</p>
            </div>
            <button disabled className="bg-slate-800 text-slate-500 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest cursor-not-allowed">
              Locked
            </button>
          </div>
        </section>

        <div className="p-8 text-center">
           <p className="text-[10px] text-slate-700 font-mono uppercase tracking-[0.2em]">
             System: AI Prompt OS // Build: 2026.05.13 // Status: Stable
           </p>
        </div>
      </div>
    </div>
  );
}
