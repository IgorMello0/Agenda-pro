-- Create contracts table
CREATE TABLE public.contracts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  professional_id BIGINT NOT NULL,
  client_id BIGINT,
  title VARCHAR NOT NULL,
  document_url TEXT NOT NULL,
  signed_document_url TEXT,
  status VARCHAR DEFAULT 'pending',
  signature_positions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create policy for professionals to manage their contracts
CREATE POLICY "Professionals can manage their contracts"
ON public.contracts
FOR ALL
TO authenticated
USING (professional_id = get_current_professional_id());

-- Add signature_image column to professionals table
ALTER TABLE public.professionals 
ADD COLUMN signature_image_url TEXT;

-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false);

-- Create storage bucket for signatures  
INSERT INTO storage.buckets (id, name, public) VALUES ('signatures', 'signatures', false);

-- Create policies for contract documents
CREATE POLICY "Professionals can upload their contract documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Professionals can view their contract documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for signature images
CREATE POLICY "Professionals can upload their signature images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Professionals can view their signature images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Professionals can update their signature images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);