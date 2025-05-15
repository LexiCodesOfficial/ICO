
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-900 border-t border-slate-800/50 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} CSViewer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
