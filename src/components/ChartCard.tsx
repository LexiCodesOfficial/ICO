
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChartBarIcon, ChevronDownIcon, TableIcon, AlertCircleIcon } from 'lucide-react';
import { ColumnSummary } from '@/utils/csvUtils';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import ColumnChart from './charts/ColumnChart';
import AreaChart from './charts/AreaChart';
import ScatterChart from './charts/ScatterChart';

interface ChartCardProps {
  title: string;
  data: Record<string, any>[];
  column: ColumnSummary;
  color?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  data, 
  column,
  color = "#3B82F6" 
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter' | 'column' | 'area'>(
    column.recommendedChart
  );
  
  const [showRawData, setShowRawData] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartId = `chart-${title.replace(/\s+/g, '-').toLowerCase()}`;

  // Check if data is available for this column
  const hasData = !column.isEmpty && data.some(record => 
    record[column.name] !== null && 
    record[column.name] !== undefined && 
    record[column.name] !== ''
  );

  // Generate description based on column type and data
  const getChartDescription = () => {
    if (!hasData) {
      return `No data available for ${title}`;
    }
    
    if (column.type === 'numeric') {
      return `Shows ${title} values ranging from ${column.min?.toFixed(2)} to ${column.max?.toFixed(2)}${column.unit ? ` ${column.unit}` : ''}`;
    } else if (column.type === 'categorical') {
      const categories = Object.keys(column.distribution || {}).length;
      return `Displays distribution of ${categories} different ${title} categories`;
    } else if (column.type === 'date') {
      return `Timeline of ${title} data points over time`;
    }
    return `Visualization of ${title} data`;
  };

  // If there's no data for this column, show a message instead of a chart
  if (!hasData) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            No data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px] text-gray-500">
          <AlertCircleIcon className="h-12 w-12 mb-4 opacity-50" />
          <p>This column contains no data or only empty values</p>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    if (showRawData) {
      return (
        <div className="max-h-[300px] overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Row
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {column.name}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
              {data.map((record, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {record[column.name]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return <BarChart data={data} column={column} color={color} />;
      case 'line':
        return <LineChart data={data} column={column} color={color} />;
      case 'pie':
        return <PieChart data={data} column={column} />;
      case 'scatter':
        return <ScatterChart data={data} column={column} color={color} />;
      case 'column':
        return <ColumnChart data={data} column={column} color={color} />;
      case 'area':
        return <AreaChart data={data} column={column} color={color} />;
      default:
        return <BarChart data={data} column={column} color={color} />;
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
                <DropdownMenuItem onClick={() => setChartType('pie')}>
                  Pie Chart
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
        <div id={chartId} ref={chartRef}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
