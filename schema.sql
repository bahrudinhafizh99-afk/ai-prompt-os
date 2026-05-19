-- AI Prompt OS - Database Schema

-- Users table (Integrated with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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

-- Prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Profiles: Users can only view/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Characters: Users can only access their own characters
CREATE POLICY "Users can manage own characters" ON public.characters FOR ALL USING (auth.uid() = user_id);

-- Prompts: Users can only access their own prompts
CREATE POLICY "Users can manage own prompts" ON public.prompts FOR ALL USING (auth.uid() = user_id);

-- Update for Visual Reference feature
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS reference_url TEXT;
