-- Primeiro, criar o tipo enum user_role se não existir
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('aluno', 'professor', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Agora criar usuário superadmin usando a função de signup do Supabase
-- Como não podemos inserir diretamente na auth.users, vamos criar um perfil diretamente
-- e depois o usuário pode fazer login

-- Criar um perfil com role superadmin
INSERT INTO public.profiles (
  id,
  user_id,
  email,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(), -- Temporário, será atualizado quando o usuário fizer signup
  'tmidiamkt@gmail.com',
  'Super Admin',
  'superadmin'::user_role,
  true,
  NOW(),
  NOW()
);