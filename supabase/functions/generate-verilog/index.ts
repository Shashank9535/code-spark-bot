
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, language } = await req.json()
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    
    if (!HUGGING_FACE_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Hugging Face token not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Generating code for prompt:', prompt, 'Language:', language)

    // Format the prompt for the Verilog model
    const formattedPrompt = language === 'verilog' 
      ? `// Generate a Verilog module for: ${prompt}\nmodule`
      : `-- Generate a VHDL entity for: ${prompt}\nlibrary IEEE;\nuse IEEE.STD_LOGIC_1164.ALL;\n\nentity`

    console.log('Formatted prompt:', formattedPrompt)
    console.log('Using token (first 10 chars):', HUGGING_FACE_TOKEN.substring(0, 10) + '...')

    // Call Hugging Face API for the fine-tuned Verilog model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/shailja/fine-tuned-codegen-6B-Verilog",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: formattedPrompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.3,
            do_sample: true,
            return_full_text: false,
            stop: ["endmodule", "end entity", "end architecture"]
          }
        }),
      }
    )

    console.log('Hugging Face API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', errorText)
      
      // Parse the error to provide better user feedback
      let userFriendlyError = 'Failed to generate code'
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.error && errorJson.error.includes('permissions')) {
          userFriendlyError = 'Your Hugging Face token does not have sufficient permissions for Inference API. Please ensure your token has "Make calls to the serverless Inference API" permission enabled.'
        } else if (errorJson.error && errorJson.error.includes('authentication')) {
          userFriendlyError = 'Invalid Hugging Face token. Please check your token and try again.'
        } else if (errorJson.error) {
          userFriendlyError = errorJson.error
        }
      } catch (e) {
        console.error('Could not parse error response:', e)
      }
      
      return new Response(
        JSON.stringify({ error: userFriendlyError, details: errorText }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const result = await response.json()
    console.log('Hugging Face response:', result)

    let generatedCode = ''
    
    if (Array.isArray(result) && result.length > 0) {
      generatedCode = result[0].generated_text || ''
    } else if (result.generated_text) {
      generatedCode = result.generated_text
    }

    // Clean up and format the generated code
    if (language === 'verilog') {
      // Add module declaration if not present
      if (!generatedCode.includes('module')) {
        const moduleName = prompt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
        generatedCode = `module ${moduleName} (\n    // Add your port declarations here\n);\n\n${generatedCode}\n\nendmodule`
      } else {
        // Ensure proper module closure
        if (!generatedCode.includes('endmodule')) {
          generatedCode += '\n\nendmodule'
        }
      }
    } else {
      // VHDL formatting
      if (!generatedCode.includes('entity')) {
        const entityName = prompt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
        generatedCode = `library IEEE;\nuse IEEE.STD_LOGIC_1164.ALL;\n\nentity ${entityName} is\n    -- Add your port declarations here\nend ${entityName};\n\narchitecture Behavioral of ${entityName} is\nbegin\n    ${generatedCode}\nend Behavioral;`
      }
    }

    return new Response(
      JSON.stringify({ 
        generatedCode: generatedCode.trim(),
        model: 'shailja/fine-tuned-codegen-6B-Verilog'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in generate-verilog function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
