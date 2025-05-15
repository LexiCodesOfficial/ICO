
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-sm z-50 sticky top-0 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              CSViewer
            </Link>
          </div>
          <div className="flex items-center space-x-4 overflow-x-auto pb-1 scrollbar-hide">
            <Link 
              to="/" 
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              About
            </Link>
            <Link 
              to="/services" 
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isActive('/services') 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/dashboard" 
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
