import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client
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

    const email = 'tmidiamkt@gmail.com'
    const password = 'Tmidia_202S'

    // Try to find an existing user by email to make this function idempotent
    let targetUser: any = null
    try {
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
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
        user_metadata: {
          full_name: 'Super Admin'
        }
      })

      if (createError) {
        console.error('Error creating auth user:', createError)
        return new Response(
          JSON.stringify({ error: createError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      targetUser = createdData?.user
    }

    if (!targetUser) {
      console.error('No user available after creation or lookup')
      return new Response(
        JSON.stringify({ error: 'Não foi possível obter o usuário administrador.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Ensure profile exists and has superadmin role (upsert for idempotency)
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          user_id: targetUser.id,
          role: 'superadmin',
          full_name: 'Super Admin'
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