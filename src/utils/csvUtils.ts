
import Papa from 'papaparse';

export interface CSVData {
  id: string;
  filename: string;
  headers: string[];
  records: Record<string, any>[];
  summary: ColumnSummary[];
  relatedColumns?: RelatedColumns[];
}

export interface RelatedColumns {
  xAxis: string;
  yAxis: string[];
  title?: string;
  recommended: 'bar' | 'line' | 'pie' | 'scatter' | 'column' | 'area';
}

export interface ColumnSummary {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'text';
  uniqueValues: number;
  hasNulls: boolean;
  min?: number;
  max?: number;
  average?: number;
  distribution?: Record<string, number>;
  recommendedChart: 'bar' | 'line' | 'pie' | 'scatter' | 'column' | 'area';
  unit?: string;
  isEmpty?: boolean;
}

export const parseCSV = (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const records = results.data as Record<string, any>[];
        
        // Generate a summary for each column
        const summary = headers.map(header => analyzeColumn(records, header));
        
        // Find related columns (like Year-Value pairs)
        const relatedColumns = findRelatedColumns(headers, summary, records);
        
        resolve({
          id: generateId(),
          filename: file.name,
          headers,
          records,
          summary,
          relatedColumns
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

const findRelatedColumns = (
  headers: string[], 
  summaries: ColumnSummary[], 
  records: Record<string, any>[]
): RelatedColumns[] => {
  const relatedColumns: RelatedColumns[] = [];
  
  // First, find potential x-axis columns (years, dates, categories)
  const potentialXAxes = summaries.filter(col => 
    (col.type === 'date' || 
     col.name.toLowerCase().includes('year') || 
     col.name.toLowerCase().includes('month') || 
     col.name.toLowerCase().includes('date') ||
     col.name.toLowerCase().includes('time')) && 
    !col.isEmpty
  );
  
  // For each potential x-axis, find adjacent y-axis columns
  potentialXAxes.forEach(xAxis => {
    const xIndex = headers.indexOf(xAxis.name);
    
    // Check next column as potential y-axis
    if (xIndex + 1 < headers.length) {
      const nextCol = summaries[xIndex + 1];
      
      // Next column should be numeric and not empty
      if (nextCol && nextCol.type === 'numeric' && !nextCol.isEmpty) {
        // Check if the next+1 column is empty or doesn't exist (pattern of X, Y, blank)
        const hasBlankAfter = (xIndex + 2 >= headers.length) || 
          (summaries[xIndex + 2]?.isEmpty === true) ||
          (records.every(r => !r[headers[xIndex + 2]]));
        
        if (hasBlankAfter || true) { // We'll consider the pattern even without blank after
          // Select chart type based on data characteristics
          let recommendedChart: 'bar' | 'line' | 'pie' | 'scatter' | 'column' | 'area' = 'line';
          
          // Year data often looks best as a column chart or line chart
          if (xAxis.name.toLowerCase().includes('year')) {
            recommendedChart = records.length > 15 ? 'line' : 'column';
          } 
          // Month data is usually good as line or area charts
          else if (xAxis.name.toLowerCase().includes('month')) {
            recommendedChart = 'line';
          }
          // Scatter for irregular date distributions
          else if (xAxis.type === 'date' && xAxis.uniqueValues > 20) {
            recommendedChart = 'scatter';
          }
          // Mix up chart types to avoid all being the same
          else {
            // Rotate among chart types for variety
            const chartTypes: Array<'bar' | 'line' | 'pie' | 'scatter' | 'column' | 'area'> = 
              ['column', 'line', 'area', 'bar', 'scatter'];
            recommendedChart = chartTypes[relatedColumns.length % chartTypes.length];
          }
          
          relatedColumns.push({
            xAxis: xAxis.name,
            yAxis: [nextCol.name],
            recommended: recommendedChart,
            title: `${nextCol.name} by ${xAxis.name}`
          });
        }
      }
    }
  });
  
  return relatedColumns;
};

export const analyzeColumn = (records: Record<string, any>[], columnName: string): ColumnSummary => {
  // Extract all values for this column
  const values = records.map(record => record[columnName]);
  
  // Count nulls/undefined/empty values
  const nullCount = values.filter(value => 
    value === null || value === undefined || value === ''
  ).length;
  
  // Count unique values
  const uniqueValues = new Set(values.filter(value => 
    value !== null && value !== undefined && value !== ''
  )).size;
  
  // Check if the column has actual data
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  const isEmpty = nonNullValues.length === 0;
  
  // Determine data type
  let type: 'numeric' | 'categorical' | 'date' | 'text' = 'text';
  let min: number | undefined;
  let max: number | undefined;
  let average: number | undefined;
  let distribution: Record<string, number> | undefined;
  let unit: string | undefined;
  
  // Check if numeric
  const isNumeric = nonNullValues.length > 0 && nonNullValues.every(v => typeof v === 'number');
  
  if (isNumeric) {
    type = 'numeric';
    const numericValues = nonNullValues as number[];
    min = Math.min(...numericValues);
    max = Math.max(...numericValues);
    average = numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
  } 
  // Check if date
  else if (nonNullValues.length > 0 && nonNullValues.every(v => !isNaN(Date.parse(String(v))))) {
    type = 'date';
  } 
  // Categorical if few unique values relative to total
  else if (uniqueValues <= 20 && uniqueValues < records.length * 0.2) {
    type = 'categorical';
    distribution = {};
    nonNullValues.forEach(value => {
      const strValue = String(value);
      distribution![strValue] = (distribution![strValue] || 0) + 1;
    });
  }
  
  // More intelligent chart selection based on data characteristics
  let recommendedChart: 'bar' | 'line' | 'pie' | 'scatter' | 'column' | 'area' = 'bar';
  
  if (type === 'numeric') {
    // For numeric data with many unique values, use line chart
    if (uniqueValues > records.length * 0.7) {
      recommendedChart = 'line';
    }
    // For numeric data with large range and distribution, use column chart
    else if (uniqueValues > 5) {
      recommendedChart = 'column';
    }
    // For numeric data with few unique values, use bar chart
    else {
      recommendedChart = 'bar';
    }
  } else if (type === 'date') {
    // Time series data is best shown with line charts
    recommendedChart = 'line';
    // If there are many values over time, consider area chart for trend visibility
    if (records.length > 15) {
      recommendedChart = 'area';
    }
  } else if (type === 'categorical') {
    if (uniqueValues <= 5) {
      // Few categories work well with pie charts
      recommendedChart = 'pie';
    } else if (uniqueValues <= 10) {
      // More categories work better with bar charts
      recommendedChart = 'bar';
    } else {
      // Too many categories, column might be better
      recommendedChart = 'column';
    }
  } else {
    // Text data with many values might be better as a scatter plot
    if (uniqueValues > records.length * 0.5) {
      recommendedChart = 'scatter';
    } else {
      recommendedChart = 'bar';
    }
  }
  
  return {
    name: columnName,
    type,
    uniqueValues,
    hasNulls: nullCount > 0,
    min,
    max,
    average,
    distribution,
    recommendedChart,
    unit,
    isEmpty
  };
};
