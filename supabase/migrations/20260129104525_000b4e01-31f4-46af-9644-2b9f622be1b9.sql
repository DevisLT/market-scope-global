-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('seller', 'buyer', 'industry', 'admin');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- Create enum for location types
CREATE TYPE public.location_type AS ENUM ('country', 'city', 'market');

-- Create enum for price trend
CREATE TYPE public.price_trend AS ENUM ('rising', 'falling', 'stable');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_first_login BOOLEAN DEFAULT true NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  is_suspended BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create username sequences table for auto-generation
CREATE TABLE public.username_sequences (
  role app_role PRIMARY KEY,
  last_sequence INTEGER DEFAULT 0 NOT NULL
);

-- Initialize sequences
INSERT INTO public.username_sequences (role, last_sequence) VALUES 
  ('seller', 0),
  ('buyer', 0),
  ('industry', 0),
  ('admin', 0);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create locations table (hierarchical: country > city > market)
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type location_type NOT NULL,
  parent_id UUID REFERENCES public.locations(id),
  country_code TEXT,
  currency_code TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(slug, type, parent_id)
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'unit' NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_approved BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create prices table (time-series data)
CREATE TABLE public.prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  price DECIMAL(15,2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD' NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  source TEXT,
  notes TEXT,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for time-series queries
CREATE INDEX idx_prices_product_recorded ON public.prices(product_id, recorded_at DESC);
CREATE INDEX idx_prices_location_recorded ON public.prices(location_id, recorded_at DESC);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status subscription_status DEFAULT 'trial' NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  price_per_month DECIMAL(10,2) DEFAULT 2.00,
  currency TEXT DEFAULT 'USD',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create messages table for in-app chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for message conversations
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id, created_at DESC);

-- Create demand_listings table (for Industry users)
CREATE TABLE public.demand_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  location_id UUID REFERENCES public.locations(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity TEXT,
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.username_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_listings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Create function to check if user is seller
CREATE OR REPLACE FUNCTION public.is_seller(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'seller')
$$;

-- Create function to check if user is buyer
CREATE OR REPLACE FUNCTION public.is_buyer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'buyer')
$$;

-- Create function to check if user is industry
CREATE OR REPLACE FUNCTION public.is_industry(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'industry')
$$;

-- Create function to check product ownership
CREATE OR REPLACE FUNCTION public.owns_product(_user_id UUID, _product_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.products
    WHERE id = _product_id AND seller_id = _user_id
  )
$$;

-- Create function to generate username
CREATE OR REPLACE FUNCTION public.generate_username(_role app_role)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prefix TEXT;
  new_seq INTEGER;
BEGIN
  -- Determine prefix based on role
  prefix := CASE _role
    WHEN 'seller' THEN 'SL'
    WHEN 'buyer' THEN 'BL'
    WHEN 'industry' THEN 'TL'
    WHEN 'admin' THEN 'AD'
  END;
  
  -- Atomically increment and get new sequence
  UPDATE public.username_sequences
  SET last_sequence = last_sequence + 1
  WHERE role = _role
  RETURNING last_sequence INTO new_seq;
  
  RETURN prefix || new_seq;
END;
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  generated_username TEXT;
BEGIN
  -- Get role from metadata (default to buyer)
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'buyer'
  );
  
  -- Generate username
  generated_username := public.generate_username(user_role);
  
  -- Create profile
  INSERT INTO public.profiles (id, username, email, full_name)
  VALUES (
    NEW.id,
    generated_username,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  -- Create free subscription
  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
  VALUES (NEW.id, 'free', 'trial', now() + interval '14 days');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_demand_listings_updated_at BEFORE UPDATE ON public.demand_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for username_sequences (admin only)
CREATE POLICY "Admins can manage sequences" ON public.username_sequences FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for locations (public read, admin write)
CREATE POLICY "Anyone can view active locations" ON public.locations FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for products
CREATE POLICY "Anyone can view approved products" ON public.products FOR SELECT USING (is_active = true AND is_approved = true);
CREATE POLICY "Sellers can view own products" ON public.products FOR SELECT TO authenticated USING (seller_id = auth.uid());
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Sellers can create products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_seller(auth.uid()) AND seller_id = auth.uid());
CREATE POLICY "Sellers can update own products" ON public.products FOR UPDATE TO authenticated USING (seller_id = auth.uid());
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for prices
CREATE POLICY "Authenticated users can view prices" ON public.prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Sellers can add prices to own products" ON public.prices FOR INSERT TO authenticated WITH CHECK (public.owns_product(auth.uid(), product_id));
CREATE POLICY "Sellers can update own product prices" ON public.prices FOR UPDATE TO authenticated USING (public.owns_product(auth.uid(), product_id));
CREATE POLICY "Admins can manage prices" ON public.prices FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- RLS Policies for demand_listings
CREATE POLICY "Anyone can view active demands" ON public.demand_listings FOR SELECT USING (is_active = true);
CREATE POLICY "Industry users can create demands" ON public.demand_listings FOR INSERT TO authenticated WITH CHECK (public.is_industry(auth.uid()) AND industry_user_id = auth.uid());
CREATE POLICY "Industry users can update own demands" ON public.demand_listings FOR UPDATE TO authenticated USING (industry_user_id = auth.uid());
CREATE POLICY "Admins can manage demands" ON public.demand_listings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Insert some initial categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Food & Agriculture', 'food-agriculture', 'Agricultural products, crops, and food items', '🌾'),
  ('Fuel & Energy', 'fuel-energy', 'Petroleum, gas, and energy products', '⛽'),
  ('Building Materials', 'building-materials', 'Construction and building supplies', '🏗️'),
  ('Consumer Goods', 'consumer-goods', 'Everyday consumer products', '🛒'),
  ('Electronics', 'electronics', 'Electronic devices and components', '📱'),
  ('Livestock', 'livestock', 'Animals and animal products', '🐄'),
  ('Textiles', 'textiles', 'Fabrics, clothing, and textile materials', '👕'),
  ('Metals & Minerals', 'metals-minerals', 'Industrial metals and mineral resources', '⚙️');

-- Insert some initial locations (countries)
INSERT INTO public.locations (name, slug, type, country_code, currency_code) VALUES
  ('United States', 'united-states', 'country', 'US', 'USD'),
  ('United Kingdom', 'united-kingdom', 'country', 'GB', 'GBP'),
  ('Nigeria', 'nigeria', 'country', 'NG', 'NGN'),
  ('Kenya', 'kenya', 'country', 'KE', 'KES'),
  ('India', 'india', 'country', 'IN', 'INR'),
  ('Germany', 'germany', 'country', 'DE', 'EUR'),
  ('Brazil', 'brazil', 'country', 'BR', 'BRL'),
  ('South Africa', 'south-africa', 'country', 'ZA', 'ZAR'),
  ('China', 'china', 'country', 'CN', 'CNY'),
  ('Japan', 'japan', 'country', 'JP', 'JPY');