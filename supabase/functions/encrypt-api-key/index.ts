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

    const { apiKeyName, apiKeyValue, userId } = await req.json()

    if (!apiKeyName || !apiKeyValue || !userId) {
      return new Response(JSON.stringify({ error: 'Missing apiKeyName, apiKeyValue, or userId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Generate a random nonce (24 bytes for XChaCha20-Poly1305)
    const nonce = crypto.getRandomValues(new Uint8Array(24));

    // Get the encryption key from environment variables
    const encryptionKey = Deno.env.get('PG_SODIUM_KEY');
    if (!encryptionKey) {
      return new Response(JSON.stringify({ error: 'PG_SODIUM_KEY environment variable not set' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Encrypt the API key using Web Crypto API (XChaCha20-Poly1305)
    const key = await crypto.subtle.importKey(
      'raw',
      decode(encryptionKey), // Decode base64 key
      { name: 'XChaCha20-Poly1305' },
      false,
      ['encrypt', 'decrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'XChaCha20-Poly1305', nonce },
      key,
      new TextEncoder().encode(apiKeyValue)
    );

    // Store the encrypted key and nonce in the database
    const { data, error } = await supabaseClient
      .from('encrypted_api_keys')
      .insert({
        user_id: userId,
        api_key_name: apiKeyName,
        encrypted_key: encode(new Uint8Array(encrypted)), // Store as base64 string
        nonce: encode(nonce), // Store nonce as base64 string
      })
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
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
