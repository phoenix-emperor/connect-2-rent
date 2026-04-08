-- 1. Create custom enum types
CREATE TYPE public.user_role AS ENUM ('RENTER', 'LANDLORD');
CREATE TYPE public.listing_status AS ENUM ('ACTIVE', 'INACTIVE', 'RENTED');

-- 2. Create the Profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role public.user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 3. Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 4. Create Listings table
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landlord_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL NOT NULL,
  status public.listing_status DEFAULT 'ACTIVE'::public.listing_status NOT NULL,
  location TEXT,
  bedrooms INT,
  bathrooms INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are viewable by everyone."
  ON public.listings FOR SELECT
  USING ( status = 'ACTIVE' OR auth.uid() = landlord_id );

CREATE POLICY "Landlords can insert listings."
  ON public.listings FOR INSERT
  WITH CHECK ( auth.uid() = landlord_id );

CREATE POLICY "Landlords can update own listings."
  ON public.listings FOR UPDATE
  USING ( auth.uid() = landlord_id );

CREATE POLICY "Landlords can delete own listings."
  ON public.listings FOR DELETE
  USING ( auth.uid() = landlord_id );

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 5. Create Listing Images table
CREATE TABLE public.listing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listing images are viewable by everyone."
  ON public.listing_images FOR SELECT
  USING ( true );

CREATE POLICY "Landlords can manage images for their listings."
  ON public.listing_images FOR ALL
  USING ( 
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_images.listing_id AND landlord_id = auth.uid()) 
  );

-- 6. Create Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages."
  ON public.messages FOR SELECT
  USING ( auth.uid() = sender_id OR auth.uid() = receiver_id );

CREATE POLICY "Users can send messages."
  ON public.messages FOR INSERT
  WITH CHECK ( auth.uid() = sender_id );

CREATE POLICY "Receivers can update message read status."
  ON public.messages FOR UPDATE
  USING ( auth.uid() = receiver_id );

-- 7. Storage bucket for uploads (Requires Storage active)
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public Access to Listing Images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'listing-images' );

CREATE POLICY "Auth Users can upload Listing Images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'listing-images' AND auth.role() = 'authenticated' );
