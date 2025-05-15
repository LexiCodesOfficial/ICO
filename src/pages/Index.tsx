
import React, { useState } from 'react';
import { CSVData, parseCSV } from '@/utils/csvUtils';
import FileUploader from '@/components/FileUploader';
import Dashboard from '@/components/Dashboard';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2Icon } from 'lucide-react';

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [datasets, setDatasets] = useState<CSVData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one CSV file');
      return;
    }

    setIsLoading(true);
    try {
      const newDatasets = await Promise.all(
        selectedFiles.map(file => parseCSV(file))
      );
      
      setDatasets(newDatasets);
      toast.success(`Successfully processed ${newDatasets.length} CSV file(s)`);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing CSV files. Please check file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setDatasets([]);
    toast.info('Cleared all data');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CSV Data Visualization Dashboard</h1>
          <p className="text-gray-600">
            Upload your CSV files to automatically visualize the data with appropriate charts
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Data</h2>
          <FileUploader 
            onFilesSelected={handleFilesSelected} 
            selectedFiles={selectedFiles} 
          />
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button 
              onClick={processFiles} 
              disabled={selectedFiles.length === 0 || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Files'
              )}
            </Button>
            
            {datasets.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearAll}
                className="w-full sm:w-auto"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Data Visualization</h2>
          <Dashboard datasets={datasets} />
        </div>
      </div>
    </div>
  );
};

export default Index;
