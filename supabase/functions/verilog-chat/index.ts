import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    console.log('Chat request:', { message, historyLength: conversationHistory.length });

    const messages = [
      {
        role: 'system',
        content: 'You are VerilogCodeBot, an expert in Verilog and VHDL hardware description languages. Help users understand digital logic design, RTL coding, synthesis, simulation, and FPGA implementation. Provide clear, accurate, and practical advice. When generating code, always include detailed comments and testbenches.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://verilogcodebot.vercel.app',
        'X-Title': 'VerilogCodeBot',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Chat response received');

    return new Response(
      JSON.stringify({
        reply: data.choices[0].message.content,
        model: data.model
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in verilog-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
