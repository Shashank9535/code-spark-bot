import React, { useEffect, useRef } from 'react';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Signal {
  name: string;
  wave: string;
  data?: string[];
}

interface WaveformData {
  signal: Signal[];
}

interface SimulationResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  waveform: WaveformData;
  timing: string;
}

interface WaveformViewerProps {
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
}

const WaveformViewer: React.FC<WaveformViewerProps> = ({ simulationResult, isSimulating }) => {
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (simulationResult?.waveform && waveformRef.current) {
      // Render waveform using canvas
      renderWaveform(simulationResult.waveform);
    }
  }, [simulationResult]);

  const renderWaveform = (waveformData: WaveformData) => {
    if (!waveformRef.current) return;
    
    const container = waveformRef.current;
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    const width = container.clientWidth || 600;
    const height = Math.max(200, waveformData.signal.length * 50 + 40);
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = '#2d2d44';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    const signalHeight = 30;
    const signalGap = 50;
    const startX = 100;
    const startY = 30;
    
    waveformData.signal.forEach((signal, index) => {
      const y = startY + index * signalGap;
      
      // Signal name
      ctx.fillStyle = '#60a5fa';
      ctx.font = '12px monospace';
      ctx.fillText(signal.name, 10, y + signalHeight / 2 + 4);
      
      // Draw waveform
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let x = startX;
      const stepWidth = (width - startX - 20) / signal.wave.length;
      
      signal.wave.split('').forEach((char, i) => {
        const nextX = x + stepWidth;
        
        if (char === '1' || char === 'H') {
          // High signal
          if (i === 0 || signal.wave[i - 1] === '0' || signal.wave[i - 1] === 'L' || signal.wave[i - 1] === '.') {
            ctx.lineTo(x, y + signalHeight);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(nextX, y);
        } else if (char === '0' || char === 'L') {
          // Low signal
          if (i === 0 || signal.wave[i - 1] === '1' || signal.wave[i - 1] === 'H') {
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + signalHeight);
          }
          ctx.lineTo(nextX, y + signalHeight);
        } else if (char === 'p' || char === 'P') {
          // Clock pulse
          ctx.lineTo(x, y + signalHeight);
          ctx.lineTo(x, y);
          ctx.lineTo(x + stepWidth / 2, y);
          ctx.lineTo(x + stepWidth / 2, y + signalHeight);
          ctx.lineTo(nextX, y + signalHeight);
        } else if (char === 'n' || char === 'N') {
          // Negative clock pulse
          ctx.lineTo(x, y);
          ctx.lineTo(x, y + signalHeight);
          ctx.lineTo(x + stepWidth / 2, y + signalHeight);
          ctx.lineTo(x + stepWidth / 2, y);
          ctx.lineTo(nextX, y);
        } else if (char === 'x' || char === 'X') {
          // Unknown/undefined
          ctx.strokeStyle = '#ef4444';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.fillRect(x, y, stepWidth, signalHeight);
          ctx.strokeStyle = '#22c55e';
        } else if (char === '.') {
          // Continue previous state
          const prevChar = i > 0 ? signal.wave[i - 1] : '0';
          if (prevChar === '1' || prevChar === 'H') {
            ctx.lineTo(nextX, y);
          } else {
            ctx.lineTo(nextX, y + signalHeight);
          }
        } else if (char === '=') {
          // Data value (bus)
          ctx.strokeStyle = '#f59e0b';
          ctx.moveTo(x, y + signalHeight / 2);
          ctx.lineTo(x + 5, y);
          ctx.lineTo(nextX - 5, y);
          ctx.lineTo(nextX, y + signalHeight / 2);
          ctx.lineTo(nextX - 5, y + signalHeight);
          ctx.lineTo(x + 5, y + signalHeight);
          ctx.lineTo(x, y + signalHeight / 2);
          ctx.strokeStyle = '#22c55e';
        }
        
        x = nextX;
      });
      
      ctx.stroke();
    });
    
    // Time axis
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px monospace';
    for (let i = 0; i <= 10; i++) {
      const x = startX + ((width - startX - 20) / 10) * i;
      ctx.fillText(`${i * 10}ns`, x - 10, height - 5);
    }
  };

  if (isSimulating) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Simulating Verilog code...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing signals and generating waveform</p>
        </div>
      </div>
    );
  }

  if (!simulationResult) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No Simulation Yet</p>
          <p className="text-sm mt-2">Generate code to see simulation output</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-400" />
          <span className="text-white font-medium">Simulation Output</span>
        </div>
        <div className="flex items-center space-x-2">
          {simulationResult.success ? (
            <span className="flex items-center text-green-400 text-sm bg-green-900/30 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              Passed
            </span>
          ) : (
            <span className="flex items-center text-red-400 text-sm bg-red-900/30 px-3 py-1 rounded-full">
              <XCircle className="h-4 w-4 mr-1" />
              Errors Found
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Timing Info */}
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Clock className="h-4 w-4" />
          <span>Simulation Time: {simulationResult.timing}</span>
        </div>

        {/* Errors */}
        {simulationResult.errors.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <h4 className="text-red-400 font-medium mb-2 flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Compilation Errors
            </h4>
            <ul className="text-red-300 text-sm space-y-1">
              {simulationResult.errors.map((error, i) => (
                <li key={i} className="font-mono">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {simulationResult.warnings.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
            <h4 className="text-yellow-400 font-medium mb-2">Warnings</h4>
            <ul className="text-yellow-300 text-sm space-y-1">
              {simulationResult.warnings.map((warning, i) => (
                <li key={i} className="font-mono">{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Console Output */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-gray-300 font-medium mb-2">Console Output</h4>
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
            {simulationResult.output}
          </pre>
        </div>

        {/* Waveform */}
        {simulationResult.success && (
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-gray-300 font-medium mb-3">Signal Waveform</h4>
            <div 
              ref={waveformRef} 
              className="w-full min-h-[200px] rounded overflow-hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WaveformViewer;
