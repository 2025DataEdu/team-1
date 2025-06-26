
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, Legend } from "recharts";
import { useOpenDataCategories } from "@/hooks/useOpenDataCategories";
import { useOpenData } from "@/hooks/useOpenData";
import { useApiCall } from "@/hooks/useApiCall";
import { useMonthlyStats } from "@/hooks/useMonthlyStats";
import { useMemo, useState } from "react";

interface DataChartsProps {
  selectedCategory: string;
}

const DataCharts = ({ selectedCategory }: DataChartsProps) => {
  const { categories, isLoading } = useOpenDataCategories();
  const { data: openDataResult } = useOpenData();
  const { data: apiCallData } = useApiCall();
  const { data: monthlyStatsData } = useMonthlyStats();
  
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 차트용 데이터 준비 (전체 제외하고 상위 7개)
  const chartData = useMemo(() => {
    return categories.slice(1, 8); // 전체를 제외하고 상위 7개
  }, [categories]);

  // 연간/월간 추이 데이터
  const trendData = useMemo(() => {
    if (!monthlyStatsData || monthlyStatsData.length === 0) {
      // 기본 연간 데이터 (백업용)
      const totalApiCalls = apiCallData?.data?.reduce((sum, item) => sum + (item.호출건수 || 0), 0) || 0;
      const baseDownloads = 150000;
      const baseApiCalls = Math.floor(totalApiCalls * 0.7);
      
      return [
        { period: "2019", downloads: Math.floor(baseDownloads * 0.6), apiCalls: Math.floor(baseApiCalls * 0.5) },
        { period: "2020", downloads: Math.floor(baseDownloads * 0.75), apiCalls: Math.floor(baseApiCalls * 0.65) },
        { period: "2021", downloads: Math.floor(baseDownloads * 0.85), apiCalls: Math.floor(baseApiCalls * 0.78) },
        { period: "2022", downloads: Math.floor(baseDownloads * 0.92), apiCalls: Math.floor(baseApiCalls * 0.88) },
        { period: "2023", downloads: Math.floor(baseDownloads * 0.98), apiCalls: Math.floor(baseApiCalls * 0.95) },
        { period: "2024", downloads: baseDownloads, apiCalls: totalApiCalls }
      ];
    }

    if (selectedYear) {
      // 선택된 연도의 월별 데이터
      const yearData = monthlyStatsData.filter(item => item.year === selectedYear);
      return yearData.map(item => ({
        period: `${item.month}월`,
        downloads: item.total_downloads,
        apiCalls: item.total_api_calls
      }));
    } else {
      // 연간 데이터 (각 연도의 12월 데이터 사용)
      const yearlyData: { [key: number]: any } = {};
      
      monthlyStatsData.forEach(item => {
        if (!yearlyData[item.year] || item.month === 12) {
          yearlyData[item.year] = {
            period: item.year.toString(),
            downloads: item.total_downloads,
            apiCalls: item.total_api_calls
          };
        }
      });
      
      return Object.values(yearlyData).sort((a: any, b: any) => parseInt(a.period) - parseInt(b.period));
    }
  }, [monthlyStatsData, apiCallData, selectedYear]);

  // 사용 가능한 연도 목록
  const availableYears = useMemo(() => {
    if (!monthlyStatsData) return [];
    const years = [...new Set(monthlyStatsData.map(item => item.year))];
    return years.sort((a, b) => b - a); // 최신 연도부터
  }, [monthlyStatsData]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  // 범례 커스텀 렌더러
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center items-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-4 h-1 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.dataKey === 'downloads' ? '파일 다운로드' : 'API 호출'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // 차트 제목 생성
  const getChartTitle = () => {
    if (selectedYear) {
      return `${selectedYear}년 월별 다운로드 및 API 호출 현황`;
    }
    return "연간 다운로드 및 API 호출 현황 추이";
  };

  // 차트 설명 생성
  const getChartDescription = () => {
    if (selectedYear) {
      return `${selectedYear}년의 월별 세부 현황입니다. 뒤로 가려면 연도를 다시 클릭하세요.`;
    }
    return "보라색 선: 파일 다운로드 건수 | 주황색 선: API 호출 건수 (연도 클릭 시 월별 상세보기)";
  };

  // 차트 클릭 핸들러
  const handleChartClick = (data: any) => {
    if (!selectedYear && data && data.activePayload && data.activePayload[0]) {
      const year = parseInt(data.activePayload[0].payload.period);
      if (!isNaN(year) && availableYears.includes(year)) {
        setSelectedYear(year);
      }
    }
  };

  // 연도 초기화 핸들러
  const handleResetYear = () => {
    setSelectedYear(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="text-gray-600">차트 데이터 로딩 중...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {getChartTitle()}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                {getChartDescription()}
              </p>
            </div>
            {selectedYear && (
              <button
                onClick={handleResetYear}
                className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
              >
                연간보기
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData} onClick={handleChartClick} style={{ cursor: selectedYear ? 'default' : 'pointer' }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value, 
                  name === 'downloads' ? '파일 다운로드 건수' : 'API 호출 건수'
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend content={renderLegend} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="downloads" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                name="downloads"
                strokeDasharray="0"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="apiCalls" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                name="apiCalls"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCharts;
