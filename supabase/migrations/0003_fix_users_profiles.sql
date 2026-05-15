-- Resolves missing profiles for registered users
-- This script safely backfills profiles for any user who registered without triggering a profile creation.
-- It also establishes an automatic trigger for all future users.

-- 1. Create the auto-profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      TRIM(CONCAT(
        COALESCE(new.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(new.raw_user_meta_data->>'last_name', '')
      )),
      'Unknown User'
    ),
    COALESCE(new.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'User'),
    COALESCE((new.raw_user_meta_data->>'role'), 'RENTER')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the trigger to Supabase auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill any existing accounts that somehow bypassed profile creation
INSERT INTO public.profiles (id, email, full_name, first_name, last_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    TRIM(CONCAT(
      COALESCE(au.raw_user_meta_data->>'first_name', ''),
      ' ',
      COALESCE(au.raw_user_meta_data->>'last_name', '')
    )),
    'Unknown User'
  ),
  COALESCE(au.raw_user_meta_data->>'first_name', 'Unknown'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'User'),
  COALESCE((au.raw_user_meta_data->>'role'), 'RENTER')::public.user_role
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
