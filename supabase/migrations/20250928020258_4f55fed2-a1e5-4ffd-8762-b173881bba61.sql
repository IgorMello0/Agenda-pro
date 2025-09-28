-- Fix foreign key relationship between contracts and clients
ALTER TABLE public.contracts 
ADD CONSTRAINT contracts_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- Fix foreign key relationship between contracts and professionals  
ALTER TABLE public.contracts 
ADD CONSTRAINT contracts_professional_id_fkey 
FOREIGN KEY (professional_id) REFERENCES public.professionals(id) ON DELETE CASCADE;