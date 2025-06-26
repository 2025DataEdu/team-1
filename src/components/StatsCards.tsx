
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, FileText, Database, TrendingUp, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { usePublicData } from "@/hooks/usePublicDataAPI";
import { useOpenData } from "@/hooks/useOpenData";
import { useApiCall } from "@/hooks/useApiCall";
import { getApiCallStatusSummary } from "@/utils/apiCallStatusUtils";

const StatsCards = () => {
  const { data: apiData, isLoading } = usePublicData();
  const { data: supabaseData, isLoading: isSupabaseLoading } = useOpenData();
  const { data: apiCallData, isLoading: isApiCallLoading } = useApiCall();
  
  // API에서 가져온 totalCount 사용, 로딩 중이거나 데이터가 없으면 기본값 사용
  const totalDatasetCount = apiData?.totalCount || 24892;
  
  // Supabase에서 가져온 국토교통부 데이터 수
  const nationalTransportDataCount = supabaseData?.totalCount || 0;
  
  // API 데이터에서 download_cnt 합산
  const totalDownloadCount = apiData?.data?.reduce((sum, item) => sum + (item.downloadCnt || 0), 0) || 523567;

  // API Call 데이터에서 실제 호출 건수 계산
  const totalApiCallCount = apiCallData?.data?.reduce((sum, item) => sum + (item.호출건수 || 0), 0) || 0;

  // API Call 데이터에서 갱신 현황 분석
  const apiCallStatusSummary = apiCallData?.data ? getApiCallStatusSummary(apiCallData.data) : { completed: 0, required: 0, unknown: 0 };

  // 호출 건수를 K 단위로 포맷하는 함수
  const formatApiCallCount = (count: number) => {
    if (count >= 1000000) {
      return Math.round(count / 1000000) + 'M';
    } else if (count >= 1000) {
      return Math.round(count / 1000) + 'K';
    }
    return count.toLocaleString();
  };

  // 활용현황 데이터 - API 호출 건수는 실제 데이터 사용
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
      value: isApiCallLoading ? "로딩중..." : formatApiCallCount(totalApiCallCount),
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    {totalDatasetCount > 0 ? ((nationalTransportDataCount / totalDatasetCount) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">
                  {isSupabaseLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-lg">로딩중...</span>
                    </div>
                  ) : (
                    nationalTransportDataCount.toLocaleString()
                  )}
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
        </CardContent>
      </Card>

      {/* 갱신 현황 카드 - API Call 데이터 기반으로 수정 */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 mb-1">
                  갱신 현황
                </CardTitle>
                <p className="text-sm text-gray-500">차기등록 예정일 기준</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isApiCallLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-yellow-300 border-t-yellow-600 rounded-full animate-spin"></div>
                <span className="text-lg text-yellow-600">로딩중...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {/* 갱신 완료 */}
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">갱신 완료</span>
                  </div>
                  <div className="text-lg font-bold text-green-900">{apiCallStatusSummary.completed}</div>
                </div>
              </div>
              
              {/* 갱신 필요 */}
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">갱신 필요</span>
                  </div>
                  <div className="text-lg font-bold text-red-900">{apiCallStatusSummary.required}</div>
                </div>
              </div>
              
              {/* 정보 없음 */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-800">정보 없음</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{apiCallStatusSummary.unknown}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
