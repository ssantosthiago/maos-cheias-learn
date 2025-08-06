-- Criar usuário superadmin
-- Primeiro, inserir o usuário na tabela auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'tmidiamkt@gmail.com',
  crypt('Tmidia_202S', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Super Admin"}',
  true,
  'authenticated'
);

-- O trigger handle_new_user() automaticamente criará um perfil com role 'aluno'
-- Agora vamos atualizar esse perfil para role 'superadmin'
UPDATE public.profiles 
SET 
  role = 'superadmin'::user_role,
  full_name = 'Super Admin',
  updated_at = NOW()
WHERE email = 'tmidiamkt@gmail.com';