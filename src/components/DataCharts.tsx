
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, Legend } from "recharts";
import { useOpenDataCategories } from "@/hooks/useOpenDataCategories";
import { useYearlyTrends } from "@/hooks/useYearlyTrends";
import { useFilesDownloadYearly } from "@/hooks/useFilesDownloadYearly";
import { useMemo, useState } from "react";

interface DataChartsProps {
  selectedCategory: string;
}

const DataCharts = ({ selectedCategory }: DataChartsProps) => {
  const { categories, isLoading } = useOpenDataCategories();
  const { data: yearlyTrendsData, isLoading: yearlyTrendsLoading } = useYearlyTrends();
  const { data: filesDownloadYearlyData, isLoading: filesDownloadYearlyLoading } = useFilesDownloadYearly();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 숫자 포맷팅 함수
  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // 차트용 데이터 준비 (전체 제외하고 상위 7개)
  const chartData = useMemo(() => {
    return categories.slice(1, 8);
  }, [categories]);

  // API 호출 데이터만 사용하는 연간 추이 데이터
  const apiCallTrendData = useMemo(() => {
    console.log('=== API 호출 차트 데이터 준비 ===');
    console.log('yearlyTrendsData:', yearlyTrendsData);
    if (yearlyTrendsData && yearlyTrendsData.length > 0) {
      console.log('API 호출 데이터만 사용:', yearlyTrendsData);
      return yearlyTrendsData.map(item => ({
        period: item.period,
        apiCalls: item.apiCalls
      }));
    }
    console.log('API 호출 데이터 없음 - 빈 배열 반환');
    return [];
  }, [yearlyTrendsData]);

  // files_download 연도별 데이터 수 차트 데이터
  const filesDownloadChartData = useMemo(() => {
    console.log('=== files_download 차트 데이터 준비 ===');
    console.log('filesDownloadYearlyData:', filesDownloadYearlyData);
    if (filesDownloadYearlyData && filesDownloadYearlyData.length > 0) {
      console.log('files_download 연도별 데이터 사용:', filesDownloadYearlyData);
      return filesDownloadYearlyData;
    }
    console.log('files_download 데이터 없음 - 빈 배열 반환');
    return [];
  }, [filesDownloadYearlyData]);

  // API 호출 Y축 도메인 계산
  const apiCallYAxisDomain = useMemo(() => {
    if (!apiCallTrendData || apiCallTrendData.length === 0) {
      return [0, 100];
    }
    const apiCallValues = apiCallTrendData.map(item => item.apiCalls).filter(val => val > 0);
    if (apiCallValues.length === 0) return [0, 100];
    
    const min = Math.min(...apiCallValues);
    const max = Math.max(...apiCallValues);
    const domainMin = min > 1000 ? Math.floor(min * 0.8) : 0;
    const domainMax = Math.ceil(max * 1.2);
    return [domainMin, domainMax];
  }, [apiCallTrendData]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  if (isLoading || yearlyTrendsLoading || filesDownloadYearlyLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">차트 데이터 로딩 중...</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">API 호출 데이터 로딩 중...</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">파일 다운로드 데이터 로딩 중...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('=== 최종 차트 렌더링 ===');
  console.log('apiCallTrendData:', apiCallTrendData);
  console.log('filesDownloadChartData:', filesDownloadChartData);
  console.log('apiCallYAxisDomain:', apiCallYAxisDomain);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <CardTitle className="text-lg font-semibold text-gray-800">API 호출 현황 (최근5년)</CardTitle>
        </CardHeader>
        <CardContent>
          {apiCallTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={apiCallTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={apiCallYAxisDomain} tickFormatter={formatNumber} />
                <Tooltip 
                  formatter={(value) => [
                    typeof value === 'number' ? value.toLocaleString() : value, 
                    'API 호출 건수'
                  ]} 
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="apiCalls" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                  name="API 호출"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">API 호출 데이터를 불러오는 중...</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">연도별 파일 다운로드 수 (최근5년)</CardTitle>
        </CardHeader>
        <CardContent>
          {filesDownloadChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={filesDownloadChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip 
                  formatter={(value) => [
                    typeof value === 'number' ? value.toLocaleString() : value, 
                    '데이터 개수'
                  ]} 
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">파일 다운로드 데이터를 불러오는 중...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCharts;
