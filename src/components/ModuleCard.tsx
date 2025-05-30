
import React from 'react';
import { Code, Play, BookOpen } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: () => void;
}

const ModuleCard = ({ title, description, icon, onGenerate }: ModuleCardProps) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <pattern id="circuit" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M0 10h5v-5h5v5h5" stroke="currentColor" strokeWidth="0.5" fill="none"/>
            <circle cx="10" cy="10" r="1" fill="currentColor"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 group-hover:bg-blue-500/30 transition-colors">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onGenerate}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Code className="h-4 w-4" />
            <span>Generate</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
              <Play className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
