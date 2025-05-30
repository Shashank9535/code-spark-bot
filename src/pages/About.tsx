
import React from 'react';
import { Cpu, Target, Users, Zap, BookOpen, Code } from 'lucide-react';
import Header from '../components/Header';

const About = () => {
  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: 'AI-Powered Generation',
      description: 'Advanced AI model specifically fine-tuned for Verilog and VHDL code generation'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Instant Results',
      description: 'Generate complex digital modules in seconds with accurate syntax and logic'
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Educational Resources',
      description: 'Integrated tutorials, truth tables, and circuit diagrams for better understanding'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Student-Focused',
      description: 'Designed specifically for VLSI students and digital design enthusiasts'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Cpu className="h-16 w-16 text-blue-400" />
              <div className="absolute inset-0 bg-blue-400 blur-lg opacity-30"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            About Verilog CodeBot
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your intelligent companion for digital design and VLSI development. 
            Generate professional-grade Verilog and VHDL code with the power of AI.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 mb-12 border border-gray-700">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-blue-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            To democratize digital design education by providing VLSI students with an intelligent, 
            accessible tool that generates high-quality Verilog and VHDL code. We believe that 
            learning digital design should be intuitive, efficient, and enjoyable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-lg mb-4">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Modules */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Supported Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'JK Flip-Flop',
              'D Flip-Flop',
              'T Flip-Flop',
              '4-bit Adder',
              '8-bit Adder',
              '1-bit Full Adder',
              '2:1 Multiplexer',
              '4:1 Multiplexer',
              '4-bit Binary Counter',
              '4-bit Shift Register',
              '4-bit Multiplexed Register',
              'Simple 4-bit ALU'
            ].map((module) => (
              <div key={module} className="bg-gray-700 rounded-lg p-3 text-center">
                <span className="text-gray-300 text-sm">{module}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Powered by Advanced AI</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built using the fine-tuned CodeGen model specifically trained on Verilog and VHDL datasets, 
            ensuring high-quality, syntactically correct code generation for all your digital design needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
