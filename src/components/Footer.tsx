import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Github, Linkedin, Twitter, Heart, Coffee, Code, Star } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`mt-12 ${
      theme.mode === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
    } border-t ${theme.mode === 'dark' ? 'border-gray-700/50' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              FAANG Interview Prep
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              Your ultimate companion for mastering Data Structures & Algorithms and acing technical interviews.
            </p>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400">and</span>
              <Coffee className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">by</span>
              <a 
                href="https://github.com/MasumRaza1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                Masum Raza
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <a
                href="https://github.com/MasumRaza1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 
                  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/masumrazacse"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 
                  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                If you found this helpful, please
              </span>
            </div>
            <a
              href="https://github.com/MasumRaza1/faangprep"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-sm text-gray-600 dark:text-gray-400 
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex flex-col items-center">
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} FAANG Interview Prep Tracker. All rights reserved.
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Made with React, TypeScript, and Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
      );
  };
  
  export default Footer; 