-- Test if we can create a test profile
INSERT INTO public.profiles (user_id, email, full_name, role, is_active) 
VALUES (gen_random_uuid(), 'test@example.com', 'Test User', 'superadmin', true);