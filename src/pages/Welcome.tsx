
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, BarChart, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import gsap from 'gsap';

const Welcome = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Animate the header elements when page loads
    gsap.fromTo(
      ".welcome-header",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Animate the description with a slight delay
    gsap.fromTo(
      ".welcome-description",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
    );

    // Animate the button with a bounce effect
    gsap.fromTo(
      ".welcome-button",
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4, ease: "back.out(1.7)" }
    );

    // Animate the feature cards
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.6, ease: "power2.out" }
    );
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 text-white">
      <Navbar />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 welcome-header">
            Unlock Insights from Your CSV Data
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto welcome-description">
            Effortlessly upload your CSV files and let our intelligent platform transform
            raw data into beautiful, insightful visualizations. No coding required, just
            instant clarity.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg group flex items-center transition-all welcome-button"
            >
              Go to Dashboard 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 text-center feature-card">
            <div className="flex justify-center mb-4">
              <Upload className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-400">
              Simply drag and drop or select your CSV files to get started in seconds.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 text-center feature-card">
            <div className="flex justify-center mb-4">
              <BarChart className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Visualization</h3>
            <p className="text-gray-400">
              Our tool automatically suggests and renders the most effective chart types for your data.
            </p>
          </div>
          
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 text-center feature-card">
            <div className="flex justify-center mb-4">
              <Zap className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Insights</h3>
            <p className="text-gray-400">
              Gain immediate understanding from complex datasets with interactive and clear charts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
