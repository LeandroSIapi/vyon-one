import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Pega o usuário logado atual
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error("Usuário não autenticado.")

    const clientId = Deno.env.get('PLUGGY_CLIENT_ID');
    const clientSecret = Deno.env.get('PLUGGY_CLIENT_SECRET');
    if (!clientId || !clientSecret) throw new Error("Credenciais da Pluggy ausentes.");

    // Autenticação na Pluggy para pegar a API Key
    const authRes = await fetch('https://api.pluggy.ai/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret }),
    });
    const authData = await authRes.json();
    const apiKey = authData.apiKey;
    if (!apiKey) throw new Error("Erro ao autenticar na Pluggy.");

    const body = await req.json().catch(() => ({}));

    // AÇÃO 1: Se recebeu um itemId, significa que a conexão acabou de acontecer. Vamos buscar as contas e salvar!
    if (body.itemId) {
      const accountsRes = await fetch(`https://api.pluggy.ai/accounts?itemId=${body.itemId}`, {
        headers: { 'X-API-KEY': apiKey },
      });
      const accountsData = await accountsRes.json();
      const accounts = accountsData.results || [];

      // Filtra ou mapeia apenas contas de crédito/cartão (ou contas correntes relevantes)
      for (const acc of accounts) {
        if (acc.type === 'CREDIT' || acc.type === 'BANK') {
          // Salva no Supabase se já não existir
          await supabaseClient.from('credit_cards').upsert({
            user_id: user.id,
            name: acc.name || 'Conta Sincronizada',
            institution: acc.institution?.name || 'Banco Open Finance',
            limit_amount: acc.creditData?.creditLimit || acc.balance || 0,
            closing_day: acc.creditData?.closeDay || 10,
            due_day: acc.creditData?.dueDay || 15,
            pluggy_item_id: body.itemId,
            pluggy_account_id: acc.id,
          }, { onConflict: 'pluggy_account_id' }); // Evita duplicar se atualizar
        }
      }

      return new Response(JSON.stringify({ success: true, count: accounts.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // AÇÃO 2: Se não veio itemId, o app está apenas pedindo o token para abrir o Widget
    const tokenRes = await fetch('https://api.pluggy.ai/connect_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
      body: JSON.stringify({}),
    });
    const tokenData = await tokenRes.json();

    return new Response(JSON.stringify({ connectToken: tokenData.accessToken }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})