
import React from 'react';
import { Play, BookOpen, ExternalLink, Clock, Star } from 'lucide-react';
import Header from '../components/Header';

const Tutorials = () => {
  const tutorials = [
    {
      title: 'Verilog Basics for Beginners',
      description: 'Learn the fundamentals of Verilog HDL with practical examples',
      duration: '45 min',
      level: 'Beginner',
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop',
      videoId: 'dQw4w9WgXcQ'
    },
    {
      title: 'Understanding Flip-Flops in Digital Design',
      description: 'Deep dive into JK, D, and T flip-flops with implementation examples',
      duration: '32 min',
      level: 'Intermediate',
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
      videoId: 'dQw4w9WgXcQ'
    },
    {
      title: 'Building Counters and Shift Registers',
      description: 'Learn to design and implement various types of counters and registers',
      duration: '28 min',
      level: 'Intermediate',
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=225&fit=crop',
      videoId: 'dQw4w9WgXcQ'
    },
    {
      title: 'Advanced ALU Design in Verilog',
      description: 'Master the art of designing arithmetic logic units with complex operations',
      duration: '52 min',
      level: 'Advanced',
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
      videoId: 'dQw4w9WgXcQ'
    },
    {
      title: 'VHDL vs Verilog: A Comprehensive Comparison',
      description: 'Understanding the differences and choosing the right HDL for your project',
      duration: '38 min',
      level: 'Intermediate',
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop',
      videoId: 'dQw4w9WgXcQ'
    },
    {
      title: 'Testbench Design and Verification',
      description: 'Learn to write comprehensive testbenches for your digital designs',
      duration: '41 min',
      level: 'Advanced',
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=225&fit=crop',
      videoId: 'dQw4w9WgXcQ'
    }
  ];

  const resources = [
    {
      title: 'Verilog Quick Reference Guide',
      description: 'Complete syntax reference and best practices',
      type: 'PDF Guide',
      link: '#'
    },
    {
      title: 'VHDL Style Guide',
      description: 'Industry standard coding conventions and guidelines',
      type: 'Documentation',
      link: '#'
    },
    {
      title: 'Digital Design Patterns',
      description: 'Common design patterns and implementation strategies',
      type: 'Cheat Sheet',
      link: '#'
    },
    {
      title: 'FPGA Development Tools',
      description: 'Comprehensive guide to popular FPGA development environments',
      type: 'Tool Guide',
      link: '#'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Learning Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master digital design with our curated collection of tutorials, guides, and educational content
          </p>
        </div>

        {/* Video Tutorials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <Play className="h-8 w-8 text-blue-400 mr-3" />
            Video Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.map((tutorial, index) => (
              <div key={index} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                {/* Thumbnail */}
                <div className="relative">
                  <img 
                    src={tutorial.thumbnail} 
                    alt={tutorial.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {tutorial.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getLevelColor(tutorial.level)}`}>
                      {tutorial.level}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 mr-1" />
                      <span className="text-sm">{tutorial.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {tutorial.description}
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Watch Tutorial</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation & Resources */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <BookOpen className="h-8 w-8 text-blue-400 mr-3" />
            Documentation & Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {resource.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {resource.description}
                    </p>
                    <span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                      {resource.type}
                    </span>
                  </div>
                  <a 
                    href={resource.link}
                    className="ml-4 p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Coding?</h2>
          <p className="text-gray-300 mb-6">
            Put your knowledge into practice with our AI-powered code generator
          </p>
          <a 
            href="/"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <span>Try Code Generator</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
