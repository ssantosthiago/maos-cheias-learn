-- Create enum type user_role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'user_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.user_role AS ENUM ('superadmin', 'professor', 'aluno');
  END IF;
END$$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'aluno',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful index for role-based queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_profiles_role'
  ) THEN
    CREATE INDEX idx_profiles_role ON public.profiles(role);
  END IF;
END$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own profile; superadmin can read all
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can select their own profile or superadmin all'
  ) THEN
    CREATE POLICY "Users can select their own profile or superadmin all"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
      auth.uid() = user_id OR public.has_role(auth.uid(), 'superadmin'::public.user_role)
    );
  END IF;
END$$;

-- Policy: users can update their own profile; superadmin can update all
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile or superadmin all'
  ) THEN
    CREATE POLICY "Users can update own profile or superadmin all"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
      auth.uid() = user_id OR public.has_role(auth.uid(), 'superadmin'::public.user_role)
    )
    WITH CHECK (
      auth.uid() = user_id OR public.has_role(auth.uid(), 'superadmin'::public.user_role)
    );
  END IF;
END$$;

-- Policy: users can insert their own profile; superadmin can insert for anyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile or superadmin any'
  ) THEN
    CREATE POLICY "Users can insert own profile or superadmin any"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
      auth.uid() = user_id OR public.has_role(auth.uid(), 'superadmin'::public.user_role)
    );
  END IF;
END$$;

-- Trigger to auto-update updated_at on update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'tr_profiles_updated_at'
  ) THEN
    CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- Create trigger on auth.users to insert into profiles if not exists, using existing function
-- Note: function public.handle_new_user() is already present per project info
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created' AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END$$;