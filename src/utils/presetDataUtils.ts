
import Papa from 'papaparse';
import { CSVData, analyzeColumn } from '@/utils/csvUtils';

// Load preset data from the CSV file
export const loadPresetData = async (): Promise<CSVData> => {
  try {
    const response = await fetch('/src/data/preset-data.csv');
    const csvText = await response.text();
    
    return parsePresetCSV(csvText);
  } catch (error) {
    console.error('Error loading preset data:', error);
    throw new Error('Failed to load preset data');
  }
};

// Parse the preset CSV data
const parsePresetCSV = (csvText: string): CSVData => {
  const results = Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });

  const headers = results.meta.fields || [];
  const records = results.data as Record<string, any>[];
  
  // Generate a summary for each column
  const summary = headers.map(header => analyzeColumn(records, header));
  
  return {
    id: 'preset-environmental-data',
    filename: 'Global Environmental Indicators',
    headers,
    records,
    summary
  };
};
