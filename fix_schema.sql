-- FIX: AI Prompt OS - Public Access Schema

-- 1. Reset & Recreate Tables with Public Friendly constraints for MVP
DROP TABLE IF EXISTS public.prompts;
DROP TABLE IF EXISTS public.characters;
DROP TABLE IF EXISTS public.profiles;

-- Create Characters table (user_id optional for testing)
CREATE TABLE public.characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, 
  name TEXT NOT NULL,
  personality TEXT,
  visual_style TEXT,
  niche TEXT,
  description TEXT,
  gender TEXT,
  age TEXT,
  country TEXT,
  language TEXT,
  hair_style TEXT,
  hair_color TEXT,
  eye_color TEXT,
  body_type TEXT,
  fashion_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Prompts table
CREATE TABLE public.prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  character_id UUID REFERENCES public.characters ON DELETE SET NULL,
  prompt_type TEXT NOT NULL,
  content TEXT NOT NULL,
  environment TEXT,
  mood TEXT,
  lighting TEXT,
  camera_style TEXT,
  motion_style TEXT,
  platform TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable RLS for now to ensure MVP testing works
ALTER TABLE public.characters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts DISABLE ROW LEVEL SECURITY;

-- 3. Just in case RLS is enabled, allow everything for Anon
GRANT ALL ON public.characters TO anon;
GRANT ALL ON public.prompts TO anon;
GRANT ALL ON public.characters TO postgres;
GRANT ALL ON public.prompts TO postgres;
GRANT ALL ON public.characters TO authenticated;
GRANT ALL ON public.prompts TO authenticated;
