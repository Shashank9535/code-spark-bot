import React from 'react';
import { ArrowRight, Cpu, Zap, BookOpen, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ModuleCard from '../components/ModuleCard';
import CodeGenerator from '../components/CodeGenerator';

const Index = () => {
  const modules = [
    {
      title: 'JK Flip-Flop',
      description: 'Generate JK flip-flop with preset and clear functionality',
      icon: <Cpu className="h-6 w-6 text-blue-400" />
    },
    {
      title: '4-bit Counter',
      description: 'Binary counter with synchronous reset and enable',
      icon: <Cpu className="h-6 w-6 text-blue-400" />
    },
    {
      title: '8-bit Adder',
      description: 'Full adder with carry chain for 8-bit arithmetic',
      icon: <Cpu className="h-6 w-6 text-blue-400" />
    },
    {
      title: '4:1 Multiplexer',
      description: 'Four-to-one multiplexer with select inputs',
      icon: <Cpu className="h-6 w-6 text-blue-400" />
    },
    {
      title: 'D Flip-Flop',
      description: 'Data flip-flop with clock enable and reset',
      icon: <Cpu className="h-6 w-6 text-blue-400" />
    },
    {
      title: '4-bit ALU',
      description: 'Arithmetic Logic Unit with multiple operations',
      icon: <Cpu className="h-6 w-6 text-blue-400" />
    }
  ];

  const features = [
    {
      icon: <Code className="h-8 w-8 text-blue-400" />,
      title: 'AI-Powered Generation',
      description: 'Advanced AI generates syntactically correct Verilog and VHDL code instantly'
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-400" />,
      title: 'Instant Results',
      description: 'Get professional-grade code in seconds, not hours of manual coding'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-400" />,
      title: 'Educational Focus',
      description: 'Built specifically for VLSI students with learning resources included'
    }
  ];

  const handleGenerateModule = (title: string) => {
    // Scroll to code generator section
    const codeGeneratorSection = document.getElementById('code-generator');
    if (codeGeneratorSection) {
      codeGeneratorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="circuit-bg" patternUnits="userSpaceOnUse" width="40" height="40">
                <path d="M0 20h10v-10h10v10h10v10h-10v10h-10v-10h-10z" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                <circle cx="20" cy="20" r="2" fill="currentColor"/>
                <circle cx="10" cy="10" r="1" fill="currentColor"/>
                <circle cx="30" cy="30" r="1" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-bg)"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Cpu className="h-20 w-20 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Verilog CodeBot
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered Verilog and VHDL code generation for VLSI students. 
              Transform your ideas into professional digital designs instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="#code-generator"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span>Start Generating</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link 
                to="/tutorials"
                className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <BookOpen className="h-5 w-5" />
                <span>View Tutorials</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">12+</div>
                <div className="text-gray-400 text-sm">Supported Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">2</div>
                <div className="text-gray-400 text-sm">HDL Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">∞</div>
                <div className="text-gray-400 text-sm">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Verilog CodeBot?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Modules */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Popular Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                onGenerate={() => handleGenerateModule(module.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Code Generator Section */}
      <section id="code-generator" className="py-20 bg-gray-800/30">
        <CodeGenerator />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <Cpu className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-xl font-bold text-white">Verilog CodeBot</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering VLSI students with AI-powered code generation
          </p>
          <div className="flex justify-center space-x-8">
            <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link to="/tutorials" className="text-gray-400 hover:text-blue-400 transition-colors">
              Tutorials
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-gray-500 text-sm">
            © 2024 Verilog CodeBot. Built for VLSI students worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
