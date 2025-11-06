-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'technicien');

-- Create enum for IP status
CREATE TYPE public.ip_status AS ENUM ('disponible', 'attribuee', 'reservee');

-- Create enum for device types
CREATE TYPE public.device_type AS ENUM ('ordinateur', 'imprimante', 'serveur', 'camera', 'autre');

-- Profiles table (additional user information)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Function to check user role (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Subnet table
CREATE TABLE public.sous_reseaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  plage_ip TEXT NOT NULL, -- Ex: 192.168.1.0/24
  passerelle TEXT NOT NULL,
  dns TEXT NOT NULL,
  total_adresses INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- IP Address table
CREATE TABLE public.adresses_ip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL UNIQUE,
  statut ip_status NOT NULL DEFAULT 'disponible',
  sous_reseau_id UUID NOT NULL REFERENCES public.sous_reseaux(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Device table
CREATE TABLE public.appareils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type device_type NOT NULL DEFAULT 'autre',
  adresse_mac TEXT NOT NULL UNIQUE,
  actif BOOLEAN NOT NULL DEFAULT true,
  derniere_detection TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attribution table (links IP to device)
CREATE TABLE public.attributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adresse_ip_id UUID NOT NULL REFERENCES public.adresses_ip(id) ON DELETE CASCADE,
  appareil_id UUID NOT NULL REFERENCES public.appareils(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date_attribution TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_liberation TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(adresse_ip_id, appareil_id, date_liberation)
);

-- IP History table
CREATE TABLE public.historique_ip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adresse_ip TEXT NOT NULL,
  appareil_nom TEXT NOT NULL,
  action TEXT NOT NULL, -- 'Attribution', 'Libération', 'Modification'
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_nom TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB
);

-- Scan tasks table
CREATE TABLE public.taches_scan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sous_reseau_id UUID NOT NULL REFERENCES public.sous_reseaux(id) ON DELETE CASCADE,
  date_scan TIMESTAMPTZ NOT NULL DEFAULT now(),
  appareils_detectes INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'en_cours',
  resultat JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sous_reseaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adresses_ip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appareils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historique_ip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taches_scan ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sous_reseaux
CREATE POLICY "Authenticated users can view subnets"
  ON public.sous_reseaux FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage subnets"
  ON public.sous_reseaux FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for adresses_ip
CREATE POLICY "Authenticated users can view IP addresses"
  ON public.adresses_ip FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage IP addresses"
  ON public.adresses_ip FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'technicien')
  );

-- RLS Policies for appareils
CREATE POLICY "Authenticated users can view devices"
  ON public.appareils FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage devices"
  ON public.appareils FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'technicien')
  );

-- RLS Policies for attributions
CREATE POLICY "Authenticated users can view attributions"
  ON public.attributions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create attributions"
  ON public.attributions FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'technicien')
  );

CREATE POLICY "Authenticated users can update attributions"
  ON public.attributions FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'technicien')
  );

-- RLS Policies for historique_ip
CREATE POLICY "Authenticated users can view history"
  ON public.historique_ip FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert history"
  ON public.historique_ip FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for taches_scan
CREATE POLICY "Authenticated users can view scan tasks"
  ON public.taches_scan FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage scan tasks"
  ON public.taches_scan FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sous_reseaux_updated_at
  BEFORE UPDATE ON public.sous_reseaux
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_adresses_ip_updated_at
  BEFORE UPDATE ON public.adresses_ip
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appareils_updated_at
  BEFORE UPDATE ON public.appareils
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nom, prenom, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_adresses_ip_sous_reseau ON public.adresses_ip(sous_reseau_id);
CREATE INDEX idx_adresses_ip_statut ON public.adresses_ip(statut);
CREATE INDEX idx_appareils_actif ON public.appareils(actif);
CREATE INDEX idx_attributions_adresse ON public.attributions(adresse_ip_id);
CREATE INDEX idx_attributions_appareil ON public.attributions(appareil_id);
CREATE INDEX idx_historique_timestamp ON public.historique_ip(timestamp DESC);