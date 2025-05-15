import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChartBarIcon, ChevronDownIcon, TableIcon } from 'lucide-react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import ColumnChart from './charts/ColumnChart';
import AreaChart from './charts/AreaChart';
import ScatterChart from './charts/ScatterChart';

interface RelatedColumnsChartProps {
  xAxis: string;
  yAxis: string;
  data: Record<string, any>[];
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'column' | 'area';
  color: string;
  title: string;
}

const RelatedColumnsChart: React.FC<RelatedColumnsChartProps> = ({
  xAxis,
  yAxis,
  data,
  chartType: initialChartType,
  color,
  title
}) => {
  const [chartType, setChartType] = useState(initialChartType);
  const [showRawData, setShowRawData] = useState(false);
  
  // Prepare data specifically for this chart type
  const chartData = data
    .filter(record => 
      record[xAxis] !== undefined && 
      record[xAxis] !== null && 
      record[xAxis] !== '' &&
      record[yAxis] !== undefined && 
      record[yAxis] !== null && 
      record[yAxis] !== ''
    )
    .map(record => ({
      name: record[xAxis],
      value: record[yAxis]
    }))
    .sort((a, b) => {
      // Try to sort numerically if they're numbers
      if (typeof a.name === 'number' && typeof b.name === 'number') {
        return a.name - b.name;
      }
      // Try to sort dates if they seem to be dates
      if (!isNaN(new Date(a.name).getTime()) && !isNaN(new Date(b.name).getTime())) {
        return new Date(a.name).getTime() - new Date(b.name).getTime();
      }
      // Otherwise sort as strings
      return String(a.name).localeCompare(String(b.name));
    });
  
  // Check if we have valid data
  const hasData = chartData.length > 0;
  
  // Generate description for the chart
  const getChartDescription = () => {
    if (!hasData) {
      return `No related data available between ${xAxis} and ${yAxis}`;
    }
    
    return `Visualizes ${yAxis} values across different ${xAxis} values`;
  };
  
  const renderChart = () => {
    if (showRawData) {
      return (
        <div className="max-h-[300px] overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {xAxis}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {yAxis}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
              {chartData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {item.name}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    // Create a custom config for column summary that the chart components expect
    const customColumn = {
      name: yAxis,
      type: 'numeric' as const,
      uniqueValues: chartData.length,
      hasNulls: false,
      recommendedChart: chartType,
      distribution: undefined
    };
    
    const chartProps = {
      data: chartData.map((item, index) => ({ 
        [xAxis]: item.name, 
        [yAxis]: item.value,
        index
      })),
      column: customColumn,
      color
    };
    
    switch (chartType) {
      case 'bar':
        return <BarChart {...chartProps} />;
      case 'line':
        return <LineChart {...chartProps} />;
      case 'scatter':
        return <ScatterChart {...chartProps} />;
      case 'column':
        return <ColumnChart {...chartProps} />;
      case 'area':
        return <AreaChart {...chartProps} />;
      default:
        return <LineChart {...chartProps} />;
    }
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            {getChartDescription()}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRawData(!showRawData)}
            className="h-8 w-8"
          >
            {showRawData ? <ChartBarIcon className="h-4 w-4" /> : <TableIcon className="h-4 w-4" />}
          </Button>
          
          {!showRawData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <span>{chartType.charAt(0).toUpperCase() + chartType.slice(1)}</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setChartType('bar')}>
                  Bar Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('column')}>
                  Column Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('line')}>
                  Line Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('area')}>
                  Area Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('scatter')}>
                  Scatter Plot
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default RelatedColumnsChart;
