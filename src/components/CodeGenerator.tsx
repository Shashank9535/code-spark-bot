import React, { useState } from 'react';
import { Send, Copy, Download, Sparkles, Code2, FileText, AlertCircle, Youtube, ExternalLink, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WaveformViewer from './WaveformViewer';
import VerilogChatbot from './VerilogChatbot';

interface ModuleInfo {
  name: string;
  prompt: string;
  youtubeLink?: string;
}

interface SimulationResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  waveform: {
    signal: Array<{
      name: string;
      wave: string;
      data?: string[];
    }>;
  };
  timing: string;
}

const popularModules: ModuleInfo[] = [
  { name: 'JK Flip-Flop', prompt: 'JK Flip-Flop with preset and clear', youtubeLink: 'https://youtu.be/775ARR6qz9U?si=RS9nXLeNBImFaKSQ' },
  { name: 'D Flip-Flop', prompt: 'D Flip-Flop with async reset', youtubeLink: 'https://youtu.be/-PZbcaw4vfo?si=RgB-Rd9lAbqSQOHP' },
  { name: 'T Flip-Flop', prompt: 'T Flip-Flop with toggle', youtubeLink: 'https://youtu.be/t3C5-qvHGjk?si=JWpC1W8dRqmG0q7k' },
  { name: '4-bit Adder', prompt: '4-bit Full Adder with carry', youtubeLink: 'https://youtu.be/smotmkf9jjk?si=Ekhdam7aarK6ves-' },
  { name: '1-bit Full Adder', prompt: '1-bit Full Adder', youtubeLink: 'https://youtu.be/bFAr1lMR7fE?si=r3OCSQ0-siRMp85x' },
  { name: '2:1 Multiplexer', prompt: '2:1 Multiplexer with select', youtubeLink: 'https://youtu.be/vVdQVxnbPgI?si=FbUiy7dDUqoQKq7r' },
  { name: '4:1 Multiplexer', prompt: '4:1 Multiplexer with select', youtubeLink: 'https://youtu.be/hvWzEMorRgM?si=N8KXgUPw7ja7Ays7' },
  { name: '4-bit ALU', prompt: '4-bit ALU with operations', youtubeLink: undefined },
  { name: '4-bit Counter', prompt: '4-bit Binary Counter with enable', youtubeLink: undefined },
];

const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [language, setLanguage] = useState('verilog');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const handleGenerate = async (customPrompt?: string) => {
    const currentPrompt = customPrompt || prompt;
    if (!currentPrompt.trim()) return;
    
    setIsGenerating(true);
    setIsSimulating(true);
    setError('');
    setSimulationResult(null);
    
    try {
      console.log('Calling generate-verilog function with:', { prompt: currentPrompt, language });
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-verilog', {
        body: { prompt: currentPrompt, language, simulate: true }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        setError(`Failed to generate code: ${functionError.message}`);
        setIsSimulating(false);
        return;
      }

      if (data?.error) {
        console.error('API error:', data.error);
        setError(data.error);
        setIsSimulating(false);
        return;
      }

      if (data?.generatedCode) {
        setGeneratedCode(data.generatedCode);
        console.log('Generated code successfully');
        
        // Set simulation result
        if (data?.simulation) {
          setSimulationResult(data.simulation);
        }
      } else {
        setError('No code was generated. Please try a different prompt.');
      }

    } catch (err) {
      console.error('Error generating code:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsSimulating(false);
    }
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* AI Chatbot */}
      <VerilogChatbot />
      
      {/* Input Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Sparkles className="h-6 w-6 text-blue-400 mr-2" />
          Verilog CodeBot - Generate & Simulate
        </h2>
        <p className="text-gray-300 mb-4 text-sm">
          Generate professional-grade Verilog/VHDL code with instant simulation and waveform visualization
        </p>
        
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
              placeholder="e.g., JK flip-flop, 4-bit counter, 8-bit adder..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Generate & Simulate</span>
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="text-red-300">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Split View: Code and Simulation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Code Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between bg-gray-900 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">
                Generated {language.toUpperCase()} Code
              </span>
            </div>
            {generatedCode && (
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
            )}
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {generatedCode ? (
              <pre className="text-green-400 text-sm font-mono">
                <code>{generatedCode}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No Code Yet</p>
                  <p className="text-sm mt-2">Enter a prompt and click Generate</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simulation Output Section */}
        <WaveformViewer 
          simulationResult={simulationResult} 
          isSimulating={isSimulating}
        />
      </div>

      {/* Popular Modules */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 text-blue-400 mr-2" />
          Popular Modules - Quick Generate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularModules.map((module) => (
            <div
              key={module.name}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{module.name}</h4>
                {module.youtubeLink && (
                  <a
                    href={module.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-400 transition-colors"
                    title="Watch tutorial on YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-3">{module.prompt}</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setPrompt(module.prompt);
                    handleGenerate(module.prompt);
                  }}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-center space-x-1"
                >
                  <Play className="h-4 w-4" />
                  <span>Generate & Simulate</span>
                </button>
                {module.youtubeLink && (
                  <a
                    href={module.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Tutorial</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
