-- Auto-create user profile when user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, first_name, timezone, language)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'first_name', SPLIT_PART(new.email, '@', 1)),
    'UTC',
    'en'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default user role
  INSERT INTO public.user_roles (user_id, role, permissions)
  VALUES (
    new.id,
    'user',
    '{"view_assessments": true}'::jsonb
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
