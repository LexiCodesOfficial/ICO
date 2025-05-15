
import React from 'react';
import { PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ColumnSummary } from '@/utils/csvUtils';

interface PieChartProps {
  data: Record<string, any>[];
  column: ColumnSummary;
}

const COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', 
  '#10B981', '#6366F1', '#EF4444', '#6B7280'
];

const PieChart: React.FC<PieChartProps> = ({ data, column }) => {
  // For categorical data with distribution
  if (column.distribution) {
    const chartData = Object.entries(column.distribution)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value) // Sort by value descending
      .slice(0, 8); // Limit to 8 categories to avoid cluttering

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  }
  
  // Fallback for non-categorical data
  const uniqueValues = new Map();
  data.forEach(record => {
    const value = record[column.name];
    if (value !== null && value !== undefined) {
      const strValue = String(value);
      uniqueValues.set(strValue, (uniqueValues.get(strValue) || 0) + 1);
    }
  });
  
  const chartData = Array.from(uniqueValues.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
