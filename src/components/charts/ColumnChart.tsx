
import React from 'react';
import { BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ColumnSummary } from '@/utils/csvUtils';

interface ColumnChartProps {
  data: Record<string, any>[];
  column: ColumnSummary;
  color?: string;
}

const ColumnChart: React.FC<ColumnChartProps> = ({ data, column, color = "#10B981" }) => {
  // For numeric data, create a histogram
  if (column.type === 'numeric' && column.min !== undefined && column.max !== undefined) {
    const binCount = 10;
    const binSize = (column.max - column.min) / binCount;
    const bins = Array(binCount).fill(0);
    
    data.forEach(record => {
      const value = record[column.name];
      if (value !== null && value !== undefined) {
        const binIndex = Math.min(
          Math.floor((value - column.min!) / binSize),
          binCount - 1
        );
        bins[binIndex]++;
      }
    });
    
    const chartData = bins.map((count, index) => {
      const binStart = column.min! + index * binSize;
      const binEnd = binStart + binSize;
      return {
        name: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        value: count
      };
    });
    
    // Determine if we need to adjust labels
    const needsAngle = true; // Almost always need angle for bin ranges
    const marginBottom = 100; // Use a larger margin for these labels
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: marginBottom }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            height={60}
            interval={0}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <text 
                  x={x} 
                  y={y + 10} 
                  dy={16} 
                  textAnchor="end"
                  fill="#666"
                  fontSize={11}
                  transform={`rotate(-45, ${x}, ${y})`}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
          <Legend />
          <Bar dataKey="value" name={`${column.name} distribution`} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  // Fallback for non-numeric data
  const chartData = data.map((record, index) => ({
    index: index + 1,
    value: record[column.name]
  })).filter(item => item.value !== null && item.value !== undefined);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name={column.name} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ColumnChart;
