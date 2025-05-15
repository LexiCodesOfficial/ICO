
import React, { useEffect, useState } from 'react';
import { CSVData } from '@/utils/csvUtils';
import Dashboard from '@/components/Dashboard';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { loadPresetData } from '@/utils/presetDataUtils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DashboardPage = () => {
  const [datasets, setDatasets] = useState<CSVData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const presetData = await loadPresetData();
        setDatasets([presetData]);
        toast.success('Preset environmental data loaded successfully');
      } catch (error) {
        console.error('Error loading preset data:', error);
        toast.error('Failed to load preset data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">Environmental Data Dashboard</h1>
          
          <div className="bg-slate-900/70 dark:bg-slate-900/70 rounded-lg shadow-md p-6 mb-8 border border-slate-800/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Global Environmental Indicators</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                <span className="ml-3 text-gray-400">Loading data...</span>
              </div>
            ) : (
              <p className="text-gray-300 mb-6">
                Visualizing key environmental metrics across multiple dimensions including temperature changes, CO2 concentrations, 
                and biodiversity indicators. This dashboard provides insights into climate trends over time.
              </p>
            )}
          </div>
          
          <div className="bg-slate-900/70 dark:bg-slate-900/70 rounded-lg shadow-md p-6 border border-slate-800/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Data Visualization</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              </div>
            ) : (
              <Dashboard datasets={datasets} />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
