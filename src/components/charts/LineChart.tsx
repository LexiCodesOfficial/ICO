
import React from 'react';
import { LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ColumnSummary } from '@/utils/csvUtils';

interface LineChartProps {
  data: Record<string, any>[];
  column: ColumnSummary;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, column, color = "#8B5CF6" }) => {
  // For date data, sort by date
  if (column.type === 'date') {
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a[column.name]);
      const dateB = new Date(b[column.name]);
      return dateA.getTime() - dateB.getTime();
    });

    const chartData = sortedData.map((record, index) => ({
      name: record[column.name],
      value: index + 1 // For simplicity, using index as value
    }));

    // Determine if we need to adjust labels
    const needsAngle = chartData.length > 5;
    const marginBottom = needsAngle ? 100 : 40;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: marginBottom }}>
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
          <Tooltip labelFormatter={(label) => `Date: ${label}`} />
          <Legend />
          <Line type="monotone" dataKey="value" name={column.name} stroke={color} activeDot={{ r: 8 }} />
        </RechartsLineChart>
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
      <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" name={column.name} stroke={color} activeDot={{ r: 8 }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
