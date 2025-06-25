
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, FileText, Database, TrendingUp } from "lucide-react";
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
      color: "text-purple-600"
    },
    {
      title: "API 호출",
      value: "892K",
      icon: FileText,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 공공데이터 수 카드 */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">
            공공데이터 수
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-50">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 공공데이터포털 전체 */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">공공데이터포털 전체</div>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? "로딩중..." : totalDatasetCount.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              <span className="font-medium">+5.2%</span> 전월 대비
            </p>
          </div>
          
          {/* 국토교통부 */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-700 mb-1 font-medium">국토교통부</div>
            <div className="text-2xl font-bold text-blue-900">
              3,247 <span className="text-sm text-blue-600 font-normal">(13.0%)</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              <span className="font-medium">+8.1%</span> 전월 대비
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 활용현황 카드 */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">
            활용현황
          </CardTitle>
          <div className="p-2 rounded-lg bg-green-50">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-700 mb-3 font-medium">국토교통부</div>
            <div className="space-y-4">
              {utilizationStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-md bg-white">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-blue-900">{stat.title}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-900">{stat.value}</div>
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
