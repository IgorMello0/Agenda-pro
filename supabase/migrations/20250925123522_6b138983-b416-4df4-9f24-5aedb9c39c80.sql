-- Allow public signup for professionals table
CREATE POLICY "Allow public signup for professionals" 
ON public.professionals 
FOR INSERT 
WITH CHECK (true);

-- Update handle_new_user function to create professional if not exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  professional_record_id BIGINT;
BEGIN
  -- Check if professional_id is provided in metadata
  IF NEW.raw_user_meta_data ? 'professional_id' THEN
    professional_record_id := (NEW.raw_user_meta_data ->> 'professional_id')::BIGINT;
  ELSE
    -- Create professional if data is provided
    IF NEW.raw_user_meta_data ? 'name' THEN
      INSERT INTO public.professionals (name, email, subscription_status)
      VALUES (
        NEW.raw_user_meta_data ->> 'name',
        NEW.email,
        'inactive'
      )
      RETURNING id INTO professional_record_id;
    END IF;
  END IF;

  -- Create profile linking to professional
  IF professional_record_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, professional_id)
    VALUES (NEW.id, professional_record_id);
  END IF;
  
  RETURN NEW;
END;
$$;