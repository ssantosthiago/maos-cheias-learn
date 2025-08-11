import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type CreateAdminBody = {
  email?: string
  password?: string
  full_name?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Block creation if a superadmin already exists
    const { count: existingCount, error: countError } = await supabaseAdmin
      .from('profiles')
      .select('user_id', { count: 'exact', head: true })
      .eq('role', 'superadmin')
      .eq('is_active', true)

    if (countError) {
      console.error('Error counting superadmins:', countError)
      return new Response(
        JSON.stringify({ error: countError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if ((existingCount ?? 0) > 0) {
      return new Response(
        JSON.stringify({ error: 'Já existe um superadmin cadastrado.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse body for email/password/full_name
    let body: CreateAdminBody = {}
    try {
      body = await req.json()
    } catch (_) {
      // ignore, will validate below
    }

    const email = (body.email || '').trim()
    const password = body.password || ''
    const full_name = (body.full_name || 'Super Admin').trim()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'E-mail e senha são obrigatórios.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 8 caracteres.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Try to find existing user by email (best-effort)
    let targetUser: any = null
    try {
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 2000 })
      if (listError) {
        console.error('Error listing users:', listError)
      } else {
        targetUser = usersData?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase()) || null
      }
    } catch (e) {
      console.error('Unexpected error while listing users:', e)
    }

    // Create the superadmin user if it doesn't exist yet
    if (!targetUser) {
      const { data: createdData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name }
      })

      if (createError) {
        // If creation failed (e.g., user already exists), try to find the user again and proceed
        console.error('Error creating auth user:', createError)
        try {
          const { data: usersData, error: listAgainError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 2000 })
          if (!listAgainError) {
            targetUser = usersData?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase()) || null
          }
        } catch (_) {}

        if (!targetUser) {
          return new Response(
            JSON.stringify({ error: createError.message || 'Falha ao criar usuário administrador.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else {
        targetUser = createdData?.user
      }
    }

    if (!targetUser) {
      console.error('No user available after creation or lookup')
      return new Response(
        JSON.stringify({ error: 'Não foi possível obter o usuário administrador.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Ensure profile exists and has superadmin role (idempotent)
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          user_id: targetUser.id,
          role: 'superadmin',
          full_name,
          email,
          is_active: true
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      console.error('Error upserting profile:', upsertError)
      return new Response(
        JSON.stringify({ error: upsertError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'Superadmin pronto com sucesso',
        user: { id: targetUser.id, email: targetUser.email }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
