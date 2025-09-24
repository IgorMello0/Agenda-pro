-- Enable RLS on all tables
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dados_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;

-- Create profiles table linked to auth.users for authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  professional_id BIGINT NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(professional_id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Function to get current professional_id
CREATE OR REPLACE FUNCTION public.get_current_professional_id()
RETURNS BIGINT AS $$
  SELECT professional_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for professionals table
CREATE POLICY "Professionals can view their own data" 
ON public.professionals 
FOR ALL 
USING (id = public.get_current_professional_id());

-- RLS Policies for clients table
CREATE POLICY "Professionals can manage their own clients" 
ON public.clients 
FOR ALL 
USING (professional_id = public.get_current_professional_id());

-- RLS Policies for dados_cliente table
CREATE POLICY "Professionals can manage their client data" 
ON public.dados_cliente 
FOR ALL 
USING (professional_id = public.get_current_professional_id());

-- RLS Policies for appointments table
CREATE POLICY "Professionals can manage their appointments" 
ON public.appointments 
FOR ALL 
USING (professional_id = public.get_current_professional_id());

-- RLS Policies for appointment_logs table
CREATE POLICY "Professionals can view their appointment logs" 
ON public.appointment_logs 
FOR ALL 
USING (
  appointment_id IN (
    SELECT id FROM public.appointments WHERE professional_id = public.get_current_professional_id()
  )
);

-- RLS Policies for payments table
CREATE POLICY "Professionals can manage their payments" 
ON public.payments 
FOR ALL 
USING (professional_id = public.get_current_professional_id());

-- RLS Policies for subscriptions table
CREATE POLICY "Professionals can view their subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (professional_id = public.get_current_professional_id());

-- RLS Policies for n8n_chat_histories table
CREATE POLICY "Professionals can view their chat histories" 
ON public.n8n_chat_histories 
FOR ALL 
USING (professional_id = public.get_current_professional_id());

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid());

-- RLS Policies for plans table (public read access)
CREATE POLICY "Anyone can view plans" 
ON public.plans 
FOR SELECT 
USING (true);

-- Trigger function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if professional_id is provided in metadata
  IF NEW.raw_user_meta_data ? 'professional_id' THEN
    INSERT INTO public.profiles (id, professional_id)
    VALUES (NEW.id, (NEW.raw_user_meta_data ->> 'professional_id')::BIGINT);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();