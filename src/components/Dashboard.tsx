
import React, { useState } from 'react';
import { CSVData, RelatedColumns } from '@/utils/csvUtils';
import ChartCard from './ChartCard';
import RelatedColumnsChart from './RelatedColumnsChart';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChartLineIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DashboardProps {
  datasets: CSVData[];
}

// Fixed array of colors for consistent styling
const CHART_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#F59E0B', // yellow
  '#10B981', // green
  '#6366F1', // indigo
  '#EF4444', // red
  '#6B7280', // gray
];

const Dashboard: React.FC<DashboardProps> = ({ datasets }) => {
  if (datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Alert className="max-w-lg">
          <ChartLineIcon className="h-4 w-4" />
          <AlertTitle>No data available</AlertTitle>
          <AlertDescription>
            Upload one or more CSV files to visualize your data in the dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs defaultValue={datasets[0].id} className="w-full">
        <TabsList className="mb-4 flex overflow-x-auto pb-1 md:flex-wrap">
          {datasets.map((dataset) => (
            <TabsTrigger key={dataset.id} value={dataset.id} className="whitespace-nowrap">
              {dataset.filename}
            </TabsTrigger>
          ))}
        </TabsList>

        {datasets.map((dataset) => {
          // Filter out columns with no data
          const nonEmptyColumns = dataset.summary.filter(column => !column.isEmpty);
          
          if (nonEmptyColumns.length === 0) {
            return (
              <TabsContent key={dataset.id} value={dataset.id} className="w-full">
                <Alert className="max-w-lg mx-auto">
                  <ChartLineIcon className="h-4 w-4" />
                  <AlertTitle>No data to visualize</AlertTitle>
                  <AlertDescription>
                    This dataset doesn't contain any columns with valid data for visualization.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            );
          }
          
          // Get the related columns for combined charts
          const relatedColumns = dataset.relatedColumns || [];
          
          // Get columns that aren't part of related columns (to avoid duplication)
          const usedColumns = new Set<string>();
          relatedColumns.forEach(rel => {
            usedColumns.add(rel.xAxis);
            rel.yAxis.forEach(y => usedColumns.add(y));
          });
          
          const independentColumns = nonEmptyColumns.filter(col => !usedColumns.has(col.name));
          
          return (
            <TabsContent key={dataset.id} value={dataset.id} className="w-full">
              {relatedColumns.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mb-3 mt-1 dark:text-gray-200">Related Data Visualizations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {relatedColumns.map((relatedColumn, index) => (
                      <RelatedColumnsChart
                        key={`${relatedColumn.xAxis}-${relatedColumn.yAxis.join('-')}`}
                        xAxis={relatedColumn.xAxis}
                        yAxis={relatedColumn.yAxis[0]}
                        data={dataset.records}
                        chartType={relatedColumn.recommended}
                        color={CHART_COLORS[index % CHART_COLORS.length]}
                        title={relatedColumn.title || `${relatedColumn.yAxis[0]} by ${relatedColumn.xAxis}`}
                      />
                    ))}
                  </div>
                  {independentColumns.length > 0 && (
                    <Separator className="my-6" />
                  )}
                </>
              )}
              
              {independentColumns.length > 0 && (
                <>
                  {relatedColumns.length > 0 && (
                    <h3 className="text-lg font-medium mb-3 dark:text-gray-200">Individual Column Visualizations</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {independentColumns.map((column, index) => (
                      <ChartCard
                        key={column.name}
                        title={column.name}
                        data={dataset.records}
                        column={column}
                        color={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default Dashboard;
