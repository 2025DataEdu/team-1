
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { useOpenDataCategories } from "@/hooks/useOpenDataCategories";
import { useOpenData } from "@/hooks/useOpenData";
import { useMemo } from "react";

interface DataChartsProps {
  selectedCategory: string;
}

const DataCharts = ({ selectedCategory }: DataChartsProps) => {
  const { categories, isLoading } = useOpenDataCategories();
  const { data: openDataResult } = useOpenData();

  // 차트용 데이터 준비 (전체 제외하고 상위 7개)
  const chartData = useMemo(() => {
    return categories.slice(1, 8); // 전체를 제외하고 상위 7개
  }, [categories]);

  // 월별 추이 데이터 (실제 데이터 기반 시뮬레이션)
  const monthlyTrend = useMemo(() => {
    const totalDatasets = openDataResult?.totalCount || 0;
    const baseCount = Math.floor(totalDatasets * 0.8);
    
    return [
      { month: "1월", datasets: baseCount, usage: Math.floor(baseCount * 30) },
      { month: "2월", datasets: Math.floor(baseCount * 1.02), usage: Math.floor(baseCount * 32) },
      { month: "3월", datasets: Math.floor(baseCount * 1.05), usage: Math.floor(baseCount * 35) },
      { month: "4월", datasets: Math.floor(baseCount * 1.08), usage: Math.floor(baseCount * 36) },
      { month: "5월", datasets: Math.floor(baseCount * 1.12), usage: Math.floor(baseCount * 34) },
      { month: "6월", datasets: totalDatasets, usage: Math.floor(totalDatasets * 37) }
    ];
  }, [openDataResult?.totalCount]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">차트 데이터 로딩 중...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            분류체계별 데이터셋 분포
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, "데이터셋 수"]}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            월별 데이터셋 및 활용 현황 추이
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value, 
                  name === 'datasets' ? '데이터셋 수' : '활용 건수'
                ]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="datasets" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="usage" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCharts;
