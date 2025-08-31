import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import {
  decode,
  encode,
} from "https://deno.land/std@0.190.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key for RLS bypass
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    )

    const { keyId, userId } = await req.json()

    if (!keyId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing keyId or userId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Retrieve the encrypted key and nonce from the database
    const { data, error } = await supabaseClient
      .from('encrypted_api_keys')
      .select('encrypted_key, nonce')
      .eq('id', keyId)
      .eq('user_id', userId) // Ensure only owner can decrypt
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: 'API key not found or unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    const encryptedKeyBase64 = data.encrypted_key;
    const nonceBase64 = data.nonce;

    // Get the encryption key from environment variables
    const encryptionKey = Deno.env.get('PG_SODIUM_KEY');
    if (!encryptionKey) {
      return new Response(JSON.stringify({ error: 'PG_SODIUM_KEY environment variable not set' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Decrypt the API key
    const key = await crypto.subtle.importKey(
      'raw',
      decode(encryptionKey),
      { name: 'XChaCha20-Poly1305' },
      false,
      ['encrypt', 'decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'XChaCha20-Poly1305', nonce: decode(nonceBase64) },
      key,
      decode(encryptedKeyBase64)
    );

    const decryptedApiKey = new TextDecoder().decode(decrypted);

    return new Response(JSON.stringify({ success: true, apiKey: decryptedApiKey }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})