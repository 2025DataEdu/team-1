import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, FileText, Database, TrendingUp, Users } from "lucide-react";
import { usePublicData } from "@/hooks/usePublicDataAPI";

const StatsCards = () => {
  const { data: apiData, isLoading } = usePublicData();
  
  // API에서 가져온 totalCount 사용, 로딩 중이거나 데이터가 없으면 기본값 사용
  const totalDatasetCount = apiData?.totalCount || 24892;
  
  // API 데이터에서 download_cnt 합산
  const totalDownloadCount = apiData?.data?.reduce((sum, item) => sum + (item.downloadCnt || 0), 0) || 523567;

  // 활용현황 데이터 ('활용 건수' 제거)
  const utilizationStats = [
    {
      title: "다운로드", 
      value: "187,432",
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "API 호출",
      value: "892K",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 공공데이터 수 카드 */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 mb-1">
                  공공데이터 수
                </CardTitle>
                <p className="text-sm text-gray-500">전체 및 국토교통부 현황</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 공공데이터포털 전체 */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-300 transition-colors duration-200 h-32">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm font-medium text-gray-700">공공데이터포털 전체</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-lg">로딩중...</span>
                    </div>
                  ) : (
                    totalDatasetCount.toLocaleString()
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">+5.2%</span>
                  </div>
                  <span className="text-xs text-gray-500">전월 대비</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 국토교통부 */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 transition-colors duration-200 shadow-sm h-32">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-bold text-blue-800">국토교통부</span>
                  <div className="px-2 py-0.5 rounded-full bg-blue-200 text-xs font-medium text-blue-800">
                    13.0%
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">
                  3,247
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-100">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">+8.1%</span>
                  </div>
                  <span className="text-xs text-blue-600">전월 대비</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 활용현황 카드 */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 mb-1">
                  활용현황
                </CardTitle>
                <p className="text-sm text-gray-500">국토교통부 데이터 활용도</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="grid grid-cols-1 gap-4">
              {utilizationStats.map((stat, index) => (
                <div key={index} className={`p-4 rounded-xl ${stat.bgColor} border ${stat.borderColor} hover:shadow-md transition-all duration-200 h-32`}>
                  <div className="flex items-center justify-between h-full">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <span className="font-semibold text-gray-800">{stat.title}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
