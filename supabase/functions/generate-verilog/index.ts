import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log('Edge function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language } = await req.json();
    console.log('Request received:', { prompt, language });
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const promptLower = prompt.toLowerCase();
    let generatedCode = '';

    if (language === 'verilog') {
      generatedCode = generateVerilogCode(promptLower);
    } else {
      generatedCode = generateVHDLCode(promptLower);
    }

    console.log('Code generated successfully');
    return new Response(
      JSON.stringify({ generatedCode, model: 'Local Verilog Generator' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateVerilogCode(prompt: string): string {
  if (prompt.includes('jk flip') || prompt.includes('jk-flip')) {
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
        j = 1; k = 0; #10;
        j = 0; k = 1; #10;
        j = 1; k = 1; #20;
        $finish;
    end
endmodule`;
  }
  
  if (prompt.includes('d flip') || prompt.includes('d-flip')) {
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
        $finish;
    end
endmodule`;
  }
  
  if (prompt.includes('t flip') || prompt.includes('t-flip')) {
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
            q <= ~q;
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
        reset = 0; t = 1; #50;
        $finish;
    end
endmodule`;
  }
  
  if (prompt.includes('1-bit') && prompt.includes('adder')) {
    return `module full_adder_1bit (
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
endmodule`;
  }
  
  if (prompt.includes('4-bit') && prompt.includes('adder')) {
    return `module full_adder (
    input wire a, b, cin,
    output wire sum, cout
);
    assign sum = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));
endmodule

module adder_4bit (
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
    full_adder fa3 (.a(a[3]), .b(b[3]), .cin(carry[2]), .sum(sum[3]), .cout(cout));
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
endmodule`;
  }
  
  if (prompt.includes('2:1') || prompt.includes('2 to 1') || prompt.includes('2-to-1')) {
    return `module mux_2to1 (
    input wire sel,
    input wire in0,
    input wire in1,
    output wire out
);
    assign out = sel ? in1 : in0;
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
endmodule`;
  }
  
  if (prompt.includes('4:1') || prompt.includes('4 to 1') || prompt.includes('4-to-1') || prompt.includes('multiplexer') || prompt.includes('mux')) {
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
endmodule`;
  }
  
  if (prompt.includes('counter')) {
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
endmodule`;
  }
  
  if (prompt.includes('alu')) {
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
            3'b000: result = a + b;           // ADD
            3'b001: {carry, result} = a + b;  // ADD with carry
            3'b010: result = a - b;           // SUB
            3'b011: result = a & b;           // AND
            3'b100: result = a | b;           // OR
            3'b101: result = a ^ b;           // XOR
            3'b110: result = ~a;              // NOT
            3'b111: result = a << 1;          // Left shift
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
        op = 3'b000; #10;
        op = 3'b010; #10;
        op = 3'b011; #10;
        op = 3'b100; #10;
        $finish;
    end
endmodule`;
  }
  
  // Generic module
  const moduleName = prompt.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
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
endmodule`;
}

function generateVHDLCode(prompt: string): string {
  if (prompt.includes('jk flip') || prompt.includes('jk-flip')) {
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
            if j = '0' and k = '0' then
                q_int <= q_int;
            elsif j = '0' and k = '1' then
                q_int <= '0';
            elsif j = '1' and k = '0' then
                q_int <= '1';
            else
                q_int <= not q_int;
            end if;
        end if;
    end process;
end Behavioral;`;
  }
  
  if (prompt.includes('d flip') || prompt.includes('d-flip')) {
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
end Behavioral;`;
  }
  
  if (prompt.includes('t flip') || prompt.includes('t-flip')) {
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
end Behavioral;`;
  }
  
  if (prompt.includes('1-bit') && prompt.includes('adder')) {
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
end Behavioral;`;
  }
  
  if (prompt.includes('4-bit') && prompt.includes('adder')) {
    return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

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
    signal result : STD_LOGIC_VECTOR(4 downto 0);
begin
    result <= std_logic_vector(unsigned('0' & a) + unsigned('0' & b) + unsigned'("" & cin));
    sum <= result(3 downto 0);
    cout <= result(4);
end Behavioral;`;
  }
  
  if (prompt.includes('2:1') || prompt.includes('2 to 1') || prompt.includes('2-to-1')) {
    return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity mux_2to1 is
    Port (
        sel : in STD_LOGIC;
        in0 : in STD_LOGIC;
        in1 : in STD_LOGIC;
        output_signal : out STD_LOGIC
    );
end mux_2to1;

architecture Behavioral of mux_2to1 is
begin
    output_signal <= in1 when sel = '1' else in0;
end Behavioral;`;
  }
  
  if (prompt.includes('4:1') || prompt.includes('4 to 1') || prompt.includes('4-to-1') || prompt.includes('multiplexer') || prompt.includes('mux')) {
    return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity mux_4to1 is
    Port (
        sel : in STD_LOGIC_VECTOR(1 downto 0);
        in0 : in STD_LOGIC;
        in1 : in STD_LOGIC;
        in2 : in STD_LOGIC;
        in3 : in STD_LOGIC;
        output_signal : out STD_LOGIC
    );
end mux_4to1;

architecture Behavioral of mux_4to1 is
begin
    process(sel, in0, in1, in2, in3)
    begin
        case sel is
            when "00" => output_signal <= in0;
            when "01" => output_signal <= in1;
            when "10" => output_signal <= in2;
            when "11" => output_signal <= in3;
            when others => output_signal <= '0';
        end case;
    end process;
end Behavioral;`;
  }
  
  if (prompt.includes('counter')) {
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
    signal count_int : unsigned(3 downto 0) := "0000";
begin
    count <= std_logic_vector(count_int);
    overflow <= '1' when count_int = "1111" and enable = '1' else '0';

    process(clk, reset)
    begin
        if reset = '1' then
            count_int <= "0000";
        elsif rising_edge(clk) then
            if enable = '1' then
                count_int <= count_int + 1;
            end if;
        end if;
    end process;
end Behavioral;`;
  }
  
  if (prompt.includes('alu')) {
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
begin
    result <= result_int;
    zero <= '1' when result_int = "0000" else '0';

    process(a, b, op)
    begin
        carry <= '0';
        case op is
            when "000" => result_int <= std_logic_vector(unsigned(a) + unsigned(b));
            when "010" => result_int <= std_logic_vector(unsigned(a) - unsigned(b));
            when "011" => result_int <= a and b;
            when "100" => result_int <= a or b;
            when "101" => result_int <= a xor b;
            when "110" => result_int <= not a;
            when "111" => result_int <= a(2 downto 0) & '0';
            when others => result_int <= "0000";
        end case;
    end process;
end Behavioral;`;
  }
  
  // Generic VHDL
  const entityName = prompt.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

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
end Behavioral;`;
}
