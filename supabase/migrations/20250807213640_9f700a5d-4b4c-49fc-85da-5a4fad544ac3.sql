-- Inserir diretamente na tabela auth.users (somente para desenvolvimento)
-- Nota: Esta é uma solução temporária para criar o primeiro superadmin

-- Primeiro, vamos inserir um registro na tabela profiles para o superadmin
INSERT INTO public.profiles (
  id,
  user_id, 
  email, 
  full_name, 
  role,
  is_active
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'tmidiamkt@gmail.com',
  'Super Admin',
  'superadmin'::user_role,
  true
) ON CONFLICT (email) DO UPDATE SET
  role = 'superadmin'::user_role,
  full_name = 'Super Admin',
  is_active = true;