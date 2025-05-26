import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-10 h-16 ${
      theme.mode === 'dark' 
        ? 'bg-gray-800 text-white border-gray-700' 
        : 'bg-white text-gray-800 border-gray-200'
      } shadow-sm border-b`}>
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className={`mr-4 p-2 rounded-full ${
              theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } md:hidden`} 
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            FAANG<span className="text-blue-500">Prep</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            className={`p-2 rounded-full transition-colors ${
              theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={toggleTheme}
            aria-label={theme.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme.mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;