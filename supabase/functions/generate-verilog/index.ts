import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
      } else if (promptLower.includes('d flip') || promptLower.includes('d-flip')) {
        generatedCode = generateDFlipFlop()
      } else if (promptLower.includes('t flip') || promptLower.includes('t-flip')) {
        generatedCode = generateTFlipFlop()
      } else if (promptLower.includes('4-bit counter') || promptLower.includes('counter')) {
        generatedCode = generate4BitCounter()
      } else if (promptLower.includes('1-bit') && (promptLower.includes('adder') || promptLower.includes('full adder'))) {
        generatedCode = generate1BitFullAdder()
      } else if (promptLower.includes('4-bit') && (promptLower.includes('adder') || promptLower.includes('full adder'))) {
        generatedCode = generate4BitAdder()
      } else if (promptLower.includes('2:1') || promptLower.includes('2 to 1') || promptLower.includes('2-to-1')) {
        generatedCode = generate2to1Multiplexer()
      } else if (promptLower.includes('4:1') || promptLower.includes('4 to 1') || promptLower.includes('4-to-1') || promptLower.includes('multiplexer') || promptLower.includes('mux')) {
        generatedCode = generate4to1Multiplexer()
      } else if (promptLower.includes('alu')) {
        generatedCode = generate4BitALU()
      } else if (promptLower.includes('shift register')) {
        generatedCode = generateShiftRegister()
      } else {
        generatedCode = generateGenericModule(prompt)
      }
    } else {
      // VHDL generation with specific modules
      if (promptLower.includes('jk flip') || promptLower.includes('jk-flip')) {
        generatedCode = generateVHDLJKFlipFlop()
      } else if (promptLower.includes('d flip') || promptLower.includes('d-flip')) {
        generatedCode = generateVHDLDFlipFlop()
      } else if (promptLower.includes('t flip') || promptLower.includes('t-flip')) {
        generatedCode = generateVHDLTFlipFlop()
      } else if (promptLower.includes('4-bit counter') || promptLower.includes('counter')) {
        generatedCode = generateVHDL4BitCounter()
      } else if (promptLower.includes('1-bit') && (promptLower.includes('adder') || promptLower.includes('full adder'))) {
        generatedCode = generateVHDL1BitFullAdder()
      } else if (promptLower.includes('4-bit') && (promptLower.includes('adder') || promptLower.includes('full adder'))) {
        generatedCode = generateVHDL4BitAdder()
      } else if (promptLower.includes('2:1') || promptLower.includes('2 to 1') || promptLower.includes('2-to-1')) {
        generatedCode = generateVHDL2to1Multiplexer()
      } else if (promptLower.includes('4:1') || promptLower.includes('4 to 1') || promptLower.includes('4-to-1') || promptLower.includes('multiplexer') || promptLower.includes('mux')) {
        generatedCode = generateVHDL4to1Multiplexer()
      } else if (promptLower.includes('alu')) {
        generatedCode = generateVHDL4BitALU()
      } else {
        generatedCode = generateGenericVHDL(prompt)
      }
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

// ============ VERILOG GENERATORS ============

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

endmodule

// Testbench
module jk_flip_flop_tb;
    reg clk, reset, preset, j, k;
    wire q, q_bar;
    
    jk_flip_flop uut (.clk(clk), .reset(reset), .preset(preset), .j(j), .k(k), .q(q), .q_bar(q_bar));
    
    initial clk = 0;
    always #5 clk = ~clk;
    
    initial begin
        reset = 1; preset = 0; j = 0; k = 0; #10;
        reset = 0; #10;
        j = 1; k = 0; #10; // Set
        j = 0; k = 1; #10; // Reset
        j = 1; k = 1; #20; // Toggle
        $finish;
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

endmodule

// Testbench
module d_flip_flop_tb;
    reg clk, reset, enable, d;
    wire q, q_bar;
    
    d_flip_flop uut (.clk(clk), .reset(reset), .enable(enable), .d(d), .q(q), .q_bar(q_bar));
    
    initial clk = 0;
    always #5 clk = ~clk;
    
    initial begin
        reset = 1; enable = 0; d = 0; #10;
        reset = 0; enable = 1; #10;
        d = 1; #10;
        d = 0; #10;
        d = 1; #10;
        $finish;
    end
endmodule`
}

function generateTFlipFlop() {
  return `module t_flip_flop (
    input wire clk,
    input wire reset,
    input wire t,
    output reg q,
    output wire q_bar
);

    assign q_bar = ~q;

    always @(posedge clk or posedge reset) begin
        if (reset)
            q <= 1'b0;
        else if (t)
            q <= ~q;  // Toggle when T is high
    end

endmodule

// Testbench
module t_flip_flop_tb;
    reg clk, reset, t;
    wire q, q_bar;
    
    t_flip_flop uut (.clk(clk), .reset(reset), .t(t), .q(q), .q_bar(q_bar));
    
    initial clk = 0;
    always #5 clk = ~clk;
    
    initial begin
        reset = 1; t = 0; #10;
        reset = 0; t = 1; #50; // Toggle multiple times
        $finish;
    end
endmodule`
}

function generate1BitFullAdder() {
  return `module full_adder_1bit (
    input wire a,
    input wire b,
    input wire cin,
    output wire sum,
    output wire cout
);

    // Sum = A XOR B XOR Cin
    assign sum = a ^ b ^ cin;
    
    // Carry = (A AND B) OR (Cin AND (A XOR B))
    assign cout = (a & b) | (cin & (a ^ b));

endmodule

// Testbench
module full_adder_1bit_tb;
    reg a, b, cin;
    wire sum, cout;
    
    full_adder_1bit uut (.a(a), .b(b), .cin(cin), .sum(sum), .cout(cout));
    
    initial begin
        {a, b, cin} = 3'b000; #10;
        {a, b, cin} = 3'b001; #10;
        {a, b, cin} = 3'b010; #10;
        {a, b, cin} = 3'b011; #10;
        {a, b, cin} = 3'b100; #10;
        {a, b, cin} = 3'b101; #10;
        {a, b, cin} = 3'b110; #10;
        {a, b, cin} = 3'b111; #10;
        $finish;
    end
endmodule`
}

function generate4BitAdder() {
  return `module adder_4bit (
    input wire [3:0] a,
    input wire [3:0] b,
    input wire cin,
    output wire [3:0] sum,
    output wire cout
);

    wire [3:0] carry;

    full_adder fa0 (.a(a[0]), .b(b[0]), .cin(cin), .sum(sum[0]), .cout(carry[0]));
    full_adder fa1 (.a(a[1]), .b(b[1]), .cin(carry[0]), .sum(sum[1]), .cout(carry[1]));
    full_adder fa2 (.a(a[2]), .b(b[2]), .cin(carry[1]), .sum(sum[2]), .cout(carry[2]));
    full_adder fa3 (.a(a[3]), .b(b[3]), .cin(carry[2]), .sum(sum[3]), .cout(carry[3]));

    assign cout = carry[3];

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
endmodule

// Testbench
module adder_4bit_tb;
    reg [3:0] a, b;
    reg cin;
    wire [3:0] sum;
    wire cout;
    
    adder_4bit uut (.a(a), .b(b), .cin(cin), .sum(sum), .cout(cout));
    
    initial begin
        a = 4'b0101; b = 4'b0011; cin = 0; #10;
        a = 4'b1111; b = 4'b0001; cin = 0; #10;
        a = 4'b1010; b = 4'b0101; cin = 1; #10;
        $finish;
    end
endmodule`
}

function generate2to1Multiplexer() {
  return `module mux_2to1 (
    input wire sel,
    input wire in0,
    input wire in1,
    output wire out
);

    // When sel = 0, output in0
    // When sel = 1, output in1
    assign out = sel ? in1 : in0;

endmodule

// Behavioral implementation
module mux_2to1_behavioral (
    input wire sel,
    input wire in0,
    input wire in1,
    output reg out
);

    always @(*) begin
        case (sel)
            1'b0: out = in0;
            1'b1: out = in1;
            default: out = 1'b0;
        endcase
    end

endmodule

// Testbench
module mux_2to1_tb;
    reg sel, in0, in1;
    wire out;
    
    mux_2to1 uut (.sel(sel), .in0(in0), .in1(in1), .out(out));
    
    initial begin
        sel = 0; in0 = 0; in1 = 1; #10;
        sel = 1; in0 = 0; in1 = 1; #10;
        sel = 0; in0 = 1; in1 = 0; #10;
        sel = 1; in0 = 1; in1 = 0; #10;
        $finish;
    end
endmodule`
}

function generate4to1Multiplexer() {
  return `module mux_4to1 (
    input wire [1:0] sel,
    input wire [3:0] in,
    output reg out
);

    always @(*) begin
        case (sel)
            2'b00: out = in[0];
            2'b01: out = in[1];
            2'b10: out = in[2];
            2'b11: out = in[3];
            default: out = 1'b0;
        endcase
    end

endmodule

// Testbench
module mux_4to1_tb;
    reg [1:0] sel;
    reg [3:0] in;
    wire out;
    
    mux_4to1 uut (.sel(sel), .in(in), .out(out));
    
    initial begin
        in = 4'b1010;
        sel = 2'b00; #10;
        sel = 2'b01; #10;
        sel = 2'b10; #10;
        sel = 2'b11; #10;
        $finish;
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

endmodule

// Testbench
module counter_4bit_tb;
    reg clk, reset, enable;
    wire [3:0] count;
    wire overflow;
    
    counter_4bit uut (.clk(clk), .reset(reset), .enable(enable), .count(count), .overflow(overflow));
    
    initial clk = 0;
    always #5 clk = ~clk;
    
    initial begin
        reset = 1; enable = 0; #10;
        reset = 0; enable = 1; #200;
        $finish;
    end
endmodule`
}

function generate4BitALU() {
  return `module alu_4bit (
    input wire [3:0] a,
    input wire [3:0] b,
    input wire [2:0] op,
    output reg [3:0] result,
    output reg zero,
    output reg carry
);

    always @(*) begin
        carry = 1'b0;
        case (op)
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

endmodule

// Testbench
module alu_4bit_tb;
    reg [3:0] a, b;
    reg [2:0] op;
    wire [3:0] result;
    wire zero, carry;
    
    alu_4bit uut (.a(a), .b(b), .op(op), .result(result), .zero(zero), .carry(carry));
    
    initial begin
        a = 4'b0101; b = 4'b0011;
        op = 3'b000; #10; // ADD
        op = 3'b010; #10; // SUB
        op = 3'b011; #10; // AND
        op = 3'b100; #10; // OR
        $finish;
    end
endmodule`
}

function generateShiftRegister() {
  return `module shift_register_4bit (
    input wire clk,
    input wire reset,
    input wire shift_en,
    input wire serial_in,
    input wire dir,  // 0 = left, 1 = right
    output reg [3:0] parallel_out,
    output wire serial_out
);

    assign serial_out = dir ? parallel_out[0] : parallel_out[3];

    always @(posedge clk or posedge reset) begin
        if (reset)
            parallel_out <= 4'b0000;
        else if (shift_en) begin
            if (dir)
                parallel_out <= {serial_in, parallel_out[3:1]};
            else
                parallel_out <= {parallel_out[2:0], serial_in};
        end
    end

endmodule`
}

function generateGenericModule(prompt: string) {
  const moduleName = prompt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  
  return `module ${moduleName} (
    input wire clk,
    input wire reset,
    input wire [7:0] data_in,
    output reg [7:0] data_out
);

    always @(posedge clk or posedge reset) begin
        if (reset)
            data_out <= 8'b0;
        else
            data_out <= data_in;
    end

endmodule`
}

// ============ VHDL GENERATORS ============

function generateVHDLJKFlipFlop() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity jk_flip_flop is
    Port (
        clk : in STD_LOGIC;
        reset : in STD_LOGIC;
        preset : in STD_LOGIC;
        j : in STD_LOGIC;
        k : in STD_LOGIC;
        q : out STD_LOGIC;
        q_bar : out STD_LOGIC
    );
end jk_flip_flop;

architecture Behavioral of jk_flip_flop is
    signal q_int : STD_LOGIC := '0';
begin
    q <= q_int;
    q_bar <= not q_int;

    process(clk, reset, preset)
    begin
        if reset = '1' then
            q_int <= '0';
        elsif preset = '1' then
            q_int <= '1';
        elsif rising_edge(clk) then
            case std_logic_vector'(j & k) is
                when "00" => q_int <= q_int;      -- Hold
                when "01" => q_int <= '0';        -- Reset
                when "10" => q_int <= '1';        -- Set
                when "11" => q_int <= not q_int;  -- Toggle
                when others => q_int <= q_int;
            end case;
        end if;
    end process;
end Behavioral;`
}

function generateVHDLDFlipFlop() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity d_flip_flop is
    Port (
        clk : in STD_LOGIC;
        reset : in STD_LOGIC;
        enable : in STD_LOGIC;
        d : in STD_LOGIC;
        q : out STD_LOGIC;
        q_bar : out STD_LOGIC
    );
end d_flip_flop;

architecture Behavioral of d_flip_flop is
    signal q_int : STD_LOGIC := '0';
begin
    q <= q_int;
    q_bar <= not q_int;

    process(clk, reset)
    begin
        if reset = '1' then
            q_int <= '0';
        elsif rising_edge(clk) then
            if enable = '1' then
                q_int <= d;
            end if;
        end if;
    end process;
end Behavioral;`
}

function generateVHDLTFlipFlop() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity t_flip_flop is
    Port (
        clk : in STD_LOGIC;
        reset : in STD_LOGIC;
        t : in STD_LOGIC;
        q : out STD_LOGIC;
        q_bar : out STD_LOGIC
    );
end t_flip_flop;

architecture Behavioral of t_flip_flop is
    signal q_int : STD_LOGIC := '0';
begin
    q <= q_int;
    q_bar <= not q_int;

    process(clk, reset)
    begin
        if reset = '1' then
            q_int <= '0';
        elsif rising_edge(clk) then
            if t = '1' then
                q_int <= not q_int;
            end if;
        end if;
    end process;
end Behavioral;`
}

function generateVHDL1BitFullAdder() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity full_adder_1bit is
    Port (
        a : in STD_LOGIC;
        b : in STD_LOGIC;
        cin : in STD_LOGIC;
        sum : out STD_LOGIC;
        cout : out STD_LOGIC
    );
end full_adder_1bit;

architecture Behavioral of full_adder_1bit is
begin
    sum <= a xor b xor cin;
    cout <= (a and b) or (cin and (a xor b));
end Behavioral;`
}

function generateVHDL4BitAdder() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity adder_4bit is
    Port (
        a : in STD_LOGIC_VECTOR(3 downto 0);
        b : in STD_LOGIC_VECTOR(3 downto 0);
        cin : in STD_LOGIC;
        sum : out STD_LOGIC_VECTOR(3 downto 0);
        cout : out STD_LOGIC
    );
end adder_4bit;

architecture Behavioral of adder_4bit is
    signal carry : STD_LOGIC_VECTOR(4 downto 0);
begin
    carry(0) <= cin;
    
    GEN_ADDER: for i in 0 to 3 generate
        sum(i) <= a(i) xor b(i) xor carry(i);
        carry(i+1) <= (a(i) and b(i)) or (carry(i) and (a(i) xor b(i)));
    end generate;
    
    cout <= carry(4);
end Behavioral;`
}

function generateVHDL2to1Multiplexer() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity mux_2to1 is
    Port (
        sel : in STD_LOGIC;
        in0 : in STD_LOGIC;
        in1 : in STD_LOGIC;
        output_sig : out STD_LOGIC
    );
end mux_2to1;

architecture Behavioral of mux_2to1 is
begin
    process(sel, in0, in1)
    begin
        case sel is
            when '0' => output_sig <= in0;
            when '1' => output_sig <= in1;
            when others => output_sig <= '0';
        end case;
    end process;
end Behavioral;`
}

function generateVHDL4to1Multiplexer() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity mux_4to1 is
    Port (
        sel : in STD_LOGIC_VECTOR(1 downto 0);
        in0 : in STD_LOGIC;
        in1 : in STD_LOGIC;
        in2 : in STD_LOGIC;
        in3 : in STD_LOGIC;
        output_sig : out STD_LOGIC
    );
end mux_4to1;

architecture Behavioral of mux_4to1 is
begin
    process(sel, in0, in1, in2, in3)
    begin
        case sel is
            when "00" => output_sig <= in0;
            when "01" => output_sig <= in1;
            when "10" => output_sig <= in2;
            when "11" => output_sig <= in3;
            when others => output_sig <= '0';
        end case;
    end process;
end Behavioral;`
}

function generateVHDL4BitCounter() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity counter_4bit is
    Port (
        clk : in STD_LOGIC;
        reset : in STD_LOGIC;
        enable : in STD_LOGIC;
        count : out STD_LOGIC_VECTOR(3 downto 0);
        overflow : out STD_LOGIC
    );
end counter_4bit;

architecture Behavioral of counter_4bit is
    signal count_int : unsigned(3 downto 0) := (others => '0');
begin
    count <= std_logic_vector(count_int);
    overflow <= '1' when count_int = "1111" and enable = '1' else '0';

    process(clk, reset)
    begin
        if reset = '1' then
            count_int <= (others => '0');
        elsif rising_edge(clk) then
            if enable = '1' then
                count_int <= count_int + 1;
            end if;
        end if;
    end process;
end Behavioral;`
}

function generateVHDL4BitALU() {
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity alu_4bit is
    Port (
        a : in STD_LOGIC_VECTOR(3 downto 0);
        b : in STD_LOGIC_VECTOR(3 downto 0);
        op : in STD_LOGIC_VECTOR(2 downto 0);
        result : out STD_LOGIC_VECTOR(3 downto 0);
        zero : out STD_LOGIC;
        carry : out STD_LOGIC
    );
end alu_4bit;

architecture Behavioral of alu_4bit is
    signal result_int : STD_LOGIC_VECTOR(3 downto 0);
    signal temp : STD_LOGIC_VECTOR(4 downto 0);
begin
    result <= result_int;
    zero <= '1' when result_int = "0000" else '0';

    process(a, b, op)
    begin
        carry <= '0';
        case op is
            when "000" =>  -- ADD
                result_int <= std_logic_vector(unsigned(a) + unsigned(b));
            when "001" =>  -- ADD with carry
                temp <= std_logic_vector(('0' & unsigned(a)) + ('0' & unsigned(b)));
                result_int <= temp(3 downto 0);
                carry <= temp(4);
            when "010" =>  -- SUB
                result_int <= std_logic_vector(unsigned(a) - unsigned(b));
            when "011" =>  -- AND
                result_int <= a and b;
            when "100" =>  -- OR
                result_int <= a or b;
            when "101" =>  -- XOR
                result_int <= a xor b;
            when "110" =>  -- NOT
                result_int <= not a;
            when "111" =>  -- Left shift
                result_int <= a(2 downto 0) & '0';
            when others =>
                result_int <= "0000";
        end case;
    end process;
end Behavioral;`
}

function generateGenericVHDL(prompt: string) {
  const entityName = prompt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity ${entityName} is
    Port (
        clk : in STD_LOGIC;
        reset : in STD_LOGIC;
        data_in : in STD_LOGIC_VECTOR(7 downto 0);
        data_out : out STD_LOGIC_VECTOR(7 downto 0)
    );
end ${entityName};

architecture Behavioral of ${entityName} is
begin
    process(clk, reset)
    begin
        if reset = '1' then
            data_out <= (others => '0');
        elsif rising_edge(clk) then
            data_out <= data_in;
        end if;
    end process;
end Behavioral;`
}
