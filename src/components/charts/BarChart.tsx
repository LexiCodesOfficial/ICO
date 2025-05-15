
import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ColumnSummary } from '@/utils/csvUtils';

interface BarChartProps {
  data: Record<string, any>[];
  column: ColumnSummary;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, column, color = "#3B82F6" }) => {
  // For categorical data with distribution
  if (column.distribution) {
    const chartData = Object.entries(column.distribution).map(([name, value]) => ({
      name,
      value
    }));

    // Determine if we need to adjust the layout to prevent label clipping
    const needsAngle = chartData.some(item => item.name.length > 5) || chartData.length > 5;
    const marginBottom = needsAngle ? 100 : 40; // Increase margin if we have angled labels

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: marginBottom }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            interval={0}
            height={60}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <text 
                  x={x} 
                  y={y + (needsAngle ? 10 : 0)} 
                  dy={16} 
                  textAnchor={needsAngle ? "end" : "middle"}
                  fill="#666"
                  fontSize={12}
                  transform={needsAngle ? `rotate(-45, ${x}, ${y})` : undefined}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={color} />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }
  
  // For numeric data
  const chartData = data.map((record, index) => ({
    index: index + 1,
    value: record[column.name]
  })).filter(item => item.value !== null && item.value !== undefined);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name={column.name} fill={color} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
