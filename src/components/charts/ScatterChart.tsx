
import React from 'react';
import { ScatterChart as RechartsScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ColumnSummary } from '@/utils/csvUtils';

interface ScatterChartProps {
  data: Record<string, any>[];
  column: ColumnSummary;
  color?: string;
}

const ScatterChart: React.FC<ScatterChartProps> = ({ data, column, color = "#6366F1" }) => {
  const chartData = data.map((record, index) => ({
    x: index,
    y: record[column.name]
  })).filter(item => item.y !== null && item.y !== undefined);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" name="Index" />
        <YAxis type="number" dataKey="y" name={column.name} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name={column.name} data={chartData} fill={color} />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChart;
