
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

    console.log('Generating code for prompt:', prompt, 'Language:', language)

    let generatedCode = ''

    // Generate code based on prompt keywords
    const promptLower = prompt.toLowerCase()

    if (language === 'verilog') {
      if (promptLower.includes('jk flip') || promptLower.includes('jk-flip')) {
        generatedCode = generateJKFlipFlop()
      } else if (promptLower.includes('4-bit counter') || promptLower.includes('counter')) {
        generatedCode = generate4BitCounter()
      } else if (promptLower.includes('8-bit adder') || promptLower.includes('adder')) {
        generatedCode = generate8BitAdder()
      } else if (promptLower.includes('multiplexer') || promptLower.includes('mux')) {
        generatedCode = generate4to1Multiplexer()
      } else if (promptLower.includes('d flip') || promptLower.includes('d-flip')) {
        generatedCode = generateDFlipFlop()
      } else if (promptLower.includes('alu')) {
        generatedCode = generate4BitALU()
      } else if (promptLower.includes('shift register')) {
        generatedCode = generateShiftRegister()
      } else {
        generatedCode = generateGenericModule(prompt)
      }
    } else {
      // VHDL generation
      generatedCode = generateVHDLCode(prompt)
    }

    return new Response(
      JSON.stringify({ 
        generatedCode: generatedCode.trim(),
        model: 'Local Verilog Generator'
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

function generateJKFlipFlop() {
  return `module jk_flip_flop (
    input wire clk,
    input wire reset,
    input wire preset,
    input wire j,
    input wire k,
    output reg q,
    output wire q_bar
);

    assign q_bar = ~q;

    always @(posedge clk or posedge reset or posedge preset) begin
        if (reset)
            q <= 1'b0;
        else if (preset)
            q <= 1'b1;
        else begin
            case ({j, k})
                2'b00: q <= q;        // Hold
                2'b01: q <= 1'b0;     // Reset
                2'b10: q <= 1'b1;     // Set
                2'b11: q <= ~q;       // Toggle
            endcase
        end
    end

endmodule`
}

function generate4BitCounter() {
  return `module counter_4bit (
    input wire clk,
    input wire reset,
    input wire enable,
    output reg [3:0] count,
    output wire overflow
);

    assign overflow = (count == 4'b1111) && enable;

    always @(posedge clk or posedge reset) begin
        if (reset)
            count <= 4'b0000;
        else if (enable)
            count <= count + 1;
    end

endmodule`
}

function generate8BitAdder() {
  return `module adder_8bit (
    input wire [7:0] a,
    input wire [7:0] b,
    input wire cin,
    output wire [7:0] sum,
    output wire cout
);

    wire [7:0] carry;

    full_adder fa0 (.a(a[0]), .b(b[0]), .cin(cin), .sum(sum[0]), .cout(carry[0]));
    full_adder fa1 (.a(a[1]), .b(b[1]), .cin(carry[0]), .sum(sum[1]), .cout(carry[1]));
    full_adder fa2 (.a(a[2]), .b(b[2]), .cin(carry[1]), .sum(sum[2]), .cout(carry[2]));
    full_adder fa3 (.a(a[3]), .b(b[3]), .cin(carry[2]), .sum(sum[3]), .cout(carry[3]));
    full_adder fa4 (.a(a[4]), .b(b[4]), .cin(carry[3]), .sum(sum[4]), .cout(carry[4]));
    full_adder fa5 (.a(a[5]), .b(b[5]), .cin(carry[4]), .sum(sum[5]), .cout(carry[5]));
    full_adder fa6 (.a(a[6]), .b(b[6]), .cin(carry[5]), .sum(sum[6]), .cout(carry[6]));
    full_adder fa7 (.a(a[7]), .b(b[7]), .cin(carry[6]), .sum(sum[7]), .cout(carry[7]));

    assign cout = carry[7];

endmodule

module full_adder (
    input wire a,
    input wire b,
    input wire cin,
    output wire sum,
    output wire cout
);

    assign sum = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));

endmodule`
}

function generate4to1Multiplexer() {
  return `module mux_4to1 (
    input wire [1:0] select,
    input wire [3:0] data_in,
    output reg data_out
);

    always @(*) begin
        case (select)
            2'b00: data_out = data_in[0];
            2'b01: data_out = data_in[1];
            2'b10: data_out = data_in[2];
            2'b11: data_out = data_in[3];
            default: data_out = 1'b0;
        endcase
    end

endmodule`
}

function generateDFlipFlop() {
  return `module d_flip_flop (
    input wire clk,
    input wire reset,
    input wire enable,
    input wire d,
    output reg q,
    output wire q_bar
);

    assign q_bar = ~q;

    always @(posedge clk or posedge reset) begin
        if (reset)
            q <= 1'b0;
        else if (enable)
            q <= d;
    end

endmodule`
}

function generate4BitALU() {
  return `module alu_4bit (
    input wire [3:0] a,
    input wire [3:0] b,
    input wire [2:0] operation,
    output reg [3:0] result,
    output reg zero,
    output reg carry
);

    always @(*) begin
        carry = 1'b0;
        case (operation)
            3'b000: result = a + b;                    // ADD
            3'b001: {carry, result} = a + b;           // ADD with carry
            3'b010: result = a - b;                    // SUB
            3'b011: result = a & b;                    // AND
            3'b100: result = a | b;                    // OR
            3'b101: result = a ^ b;                    // XOR
            3'b110: result = ~a;                       // NOT
            3'b111: result = a << 1;                   // Left shift
            default: result = 4'b0000;
        endcase
        
        zero = (result == 4'b0000);
    end

endmodule`
}

function generateShiftRegister() {
  return `module shift_register_4bit (
    input wire clk,
    input wire reset,
    input wire shift_enable,
    input wire serial_in,
    input wire direction,  // 0 for left, 1 for right
    output reg [3:0] parallel_out,
    output wire serial_out
);

    assign serial_out = direction ? parallel_out[0] : parallel_out[3];

    always @(posedge clk or posedge reset) begin
        if (reset)
            parallel_out <= 4'b0000;
        else if (shift_enable) begin
            if (direction) // Right shift
                parallel_out <= {serial_in, parallel_out[3:1]};
            else // Left shift
                parallel_out <= {parallel_out[2:0], serial_in};
        end
    end

endmodule`
}

function generateGenericModule(prompt) {
  const moduleName = prompt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  
  return `module ${moduleName} (
    input wire clk,
    input wire reset,
    // Add your input ports here
    output reg output_signal
    // Add your output ports here
);

    // Add your logic here
    always @(posedge clk or posedge reset) begin
        if (reset)
            output_signal <= 1'b0;
        else begin
            // Implement your functionality here
            output_signal <= 1'b1;
        end
    end

endmodule`
}

function generateVHDLCode(prompt) {
  const entityName = prompt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity ${entityName} is
    Port (
        clk : in STD_LOGIC;
        reset : in STD_LOGIC;
        -- Add your port declarations here
        output_signal : out STD_LOGIC
    );
end ${entityName};

architecture Behavioral of ${entityName} is
begin
    process(clk, reset)
    begin
        if reset = '1' then
            output_signal <= '0';
        elsif rising_edge(clk) then
            -- Implement your functionality here
            output_signal <= '1';
        end if;
    end process;
end Behavioral;`
}
