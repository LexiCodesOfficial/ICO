
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { BarChart3, Settings, FileType, HelpCircle } from 'lucide-react';
import gsap from 'gsap';

const Services = () => {
  useEffect(() => {
    // Animate the title
    gsap.fromTo(
      ".services-title",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Animate the service cards with a staggered grid effect
    gsap.fromTo(
      ".service-card",
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6, 
        stagger: {
          grid: [2, 2],
          from: "start",
          amount: 0.4
        }, 
        ease: "power2.out" 
      }
    );

    // Animate the icons
    gsap.fromTo(
      ".service-icon",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, delay: 0.4, stagger: 0.15, ease: "back.out(1.7)" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 text-white">
      <Navbar />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-10 services-title">
            Features & Services
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 service-card">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center p-3 bg-green-600/20 rounded-full mr-4 service-icon">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Automatic Chart Generation</h3>
            </div>
            <p className="text-gray-300">
              Upload your CSV, and we intelligently analyze its structure to suggest and render the most suitable chart types, from bar charts to scatter plots.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 service-card">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center p-3 bg-green-600/20 rounded-full mr-4 service-icon">
                <Settings className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Interactive Customization</h3>
            </div>
            <p className="text-gray-300">
              Fine-tune your visualizations. Select different chart types, group data, and customize appearances to best represent your insights.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 service-card">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center p-3 bg-green-600/20 rounded-full mr-4 service-icon">
                <FileType className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Data Type Detection</h3>
            </div>
            <p className="text-gray-300">
              Our platform automatically detects data types (numeric, categorical, date/time) to ensure accurate and meaningful chart representations.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 service-card">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center p-3 bg-green-600/20 rounded-full mr-4 service-icon">
                <HelpCircle className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">User Support & Tutorials</h3>
            </div>
            <p className="text-gray-300">
              Access helpful guides, tutorials, and responsive support to make the most out of your data visualization journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
