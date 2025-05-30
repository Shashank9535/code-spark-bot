
import React, { useState } from 'react';
import { Send, Copy, Download, Sparkles, Code2, FileText } from 'lucide-react';

const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [language, setLanguage] = useState('verilog');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const sampleVerilog = `module ${prompt.toLowerCase().replace(/\s+/g, '_')} (
    input clk,
    input reset,
    input [3:0] data_in,
    output reg [3:0] data_out
);

always @(posedge clk or posedge reset) begin
    if (reset)
        data_out <= 4'b0000;
    else
        data_out <= data_in;
end

endmodule`;

      const sampleVHDL = `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity ${prompt.toLowerCase().replace(/\s+/g, '_')} is
    Port ( clk : in STD_LOGIC;
           reset : in STD_LOGIC;
           data_in : in STD_LOGIC_VECTOR (3 downto 0);
           data_out : out STD_LOGIC_VECTOR (3 downto 0));
end ${prompt.toLowerCase().replace(/\s+/g, '_')};

architecture Behavioral of ${prompt.toLowerCase().replace(/\s+/g, '_')} is
begin
    process(clk, reset)
    begin
        if reset = '1' then
            data_out <= "0000";
        elsif rising_edge(clk) then
            data_out <= data_in;
        end if;
    end process;
end Behavioral;`;

      setGeneratedCode(language === 'verilog' ? sampleVerilog : sampleVHDL);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${prompt.toLowerCase().replace(/\s+/g, '_')}.${language === 'verilog' ? 'v' : 'vhd'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Input Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Sparkles className="h-6 w-6 text-blue-400 mr-2" />
          Generate Your Code
        </h2>
        
        <div className="space-y-4">
          {/* Language Selection */}
          <div className="flex space-x-4">
            <button
              onClick={() => setLanguage('verilog')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'verilog'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Verilog
            </button>
            <button
              onClick={() => setLanguage('vhdl')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'vhdl'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              VHDL
            </button>
          </div>

          {/* Input */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 4-bit counter, JK flip-flop, 8-bit adder..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      {generatedCode && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between bg-gray-900 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">
                Generated {language.toUpperCase()} Code
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={downloadCode}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Example Prompts */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 text-blue-400 mr-2" />
          Example Prompts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'JK Flip-Flop',
            '4-bit Binary Counter',
            '8-bit Full Adder',
            '4:1 Multiplexer',
            'D Flip-Flop with Reset',
            '4-bit Shift Register'
          ].map((example) => (
            <button
              key={example}
              onClick={() => setPrompt(example)}
              className="text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
