import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PromptState {
  // Prompt Builder Data
  promptType: string;
  character: string;
  environment: string;
  mood: string;
  lighting: string;
  cameraStyle: string;
  platform: string;
  additionalNotes: string;

  // Motion Control Data
  cameraMotion: string;
  humanMotion: string;
  motionIntensity: 'Low' | 'Medium' | 'High';
  realismStyle: string;
  targetPlatform: 'Generic' | 'Kling' | 'Runway' | 'Luma';
  tags: string;
  referenceUrl: string;

  // Actions
  setField: (field: keyof PromptState, value: any) => void;
  generateMasterPrompt: () => string;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      promptType: 'Video Prompt',
      character: 'Default Character',
      environment: 'Luxury Cafe',
      mood: 'Elegant',
      lighting: 'Golden Hour',
      cameraStyle: 'Close Up',
      platform: 'TikTok',
      additionalNotes: '',

      cameraMotion: 'Tracking Shot',
      humanMotion: 'Natural Walking',
      motionIntensity: 'Medium',
      realismStyle: 'Movie Cinematic',
      targetPlatform: 'Generic',
      tags: '',
      referenceUrl: '',

      setField: (field, value) => set((state) => ({ ...state, [field]: value })),

      generateMasterPrompt: () => {
        const s = get();
        
        // Technical Mappings
        const lensMap: Record<string, string> = {
          'Close Up': '85mm f/1.4 prime lens, shallow depth of field, sharp focus on eyes',
          'Tracking Shot': '35mm anamorphic lens, cinematic wide-angle, dynamic perspective',
          'Drone Shot': '24mm wide angle, sweeping aerial view, deep depth of field',
          'POV': '18mm ultra-wide lens, immersive perspective, natural head-mounted camera feel',
          'Portrait': '50mm f/1.2 lens, soft bokeh, flattering facial compression'
        };

        const lightingMap: Record<string, string> = {
          'Golden Hour': 'Warm volumetric lighting, long shadows, soft orange and gold tones, rim lighting on hair',
          'Natural Light': 'Global illumination, soft diffused daylight coming from windows, realistic highlights',
          'Soft Light': 'High-key lighting, soft shadows, wrap-around light, clean and commercial look',
          'Neon': 'Dual-tone lighting, cyan and magenta reflections, high contrast, cinematic bloom',
          'Dark Cinematic': 'Low-key lighting, high contrast, moody shadows, slight teal and orange color grade'
        };

        const platformOptimization: Record<string, string> = {
          'Kling': 'OPTIMIZATION [KLING AI]: Focus on ultra-fluid physics, 1080p high bitrate, realistic facial muscle movement, negative prompt focus on jittery motion.',
          'Runway': 'OPTIMIZATION [RUNWAY GEN-3]: Motion Brush ready, high consistency mode, 16:9 cinematic aspect ratio, deep temporal coherence.',
          'Luma': 'OPTIMIZATION [LUMA DREAM MACHINE]: Keyframe consistency priority, realistic lighting bounce, 120fps slow-motion feel, sharp texture retention.'
        };

        const selectedLens = lensMap[s.cameraStyle] || 'Cinematic lens';
        const selectedLighting = lightingMap[s.lighting] || 'Realistic lighting';
        const optimizationText = platformOptimization[s.targetPlatform] || '';

        return `### DIRECTOR'S MASTER COMMAND (GPT CINEMATIC AI) ###

You are an expert AI Cinematographer and Creative Director. 
Your goal is to transform the following structured data into a high-end cinematic prompt.

${optimizationText ? `---
### PLATFORM TARGET: ${s.targetPlatform}
${optimizationText}\n` : ''}

---
### 1. CORE SCENE SPECS
- **Platform/Format:** ${s.platform} (${s.promptType})
- **Character Identity:** ${s.character !== 'Default Character' ? `Maintain 100% consistency for "${s.character}". Analyze references for hair, eyes, and skin texture.` : 'Focus on high-detail realistic human features.'}
- **Environment:** ${s.environment}
- **Mood & Atmosphere:** ${s.mood}

### 2. TECHNICAL SPECIFICATIONS
- **Camera Configuration:** ${selectedLens}
- **Cinematography Style:** ${s.cameraStyle} with ${s.cameraMotion}
- **Lighting Design:** ${selectedLighting}
- **Realism Target:** ${s.realismStyle} (8k resolution, Unreal Engine 5.4 render style, RAW photography quality)

### 3. MOVEMENT & ACTION
- **Human Motion:** ${s.humanMotion}
- **Intensity:** ${s.motionIntensity} motion blur and natural fluidity
- **Camera Movement:** ${s.cameraMotion} - Ensure smooth parallax and authentic camera shake if handheld.

---
### 4. PRODUCTION INSTRUCTIONS
Analyze any uploaded reference images for:
1. Facial structure and skin imperfections (pores, freckles, micro-sweat).
2. Lighting direction and shadow falloff.
3. Material textures (fabric of clothes, reflections on surfaces).

${s.additionalNotes ? `### 5. ADDITIONAL CREATIVE NOTES\n${s.additionalNotes}\n` : ''}

---
### TASK: GENERATE FINAL PROMPT OUTPUT
Generate the following sections in a clear, copy-paste format:
1. **ULTRA-REALISTIC PROMPT:** (The detailed scene description)
2. **MOTION INSTRUCTIONS:** (Specific motion parameters for SVD/Kling/Runway)
3. **NEGATIVE PROMPT:** (What to avoid: artificial look, plastic skin, bad anatomy)
4. **COLOR GRADE:** (Specific LUT or color tone instructions)`;
      },
    }),
    {
      name: 'ai-prompt-os-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
