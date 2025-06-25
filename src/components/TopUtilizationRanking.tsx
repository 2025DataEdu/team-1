
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Database, Building2, TrendingUp } from "lucide-react";

const TopUtilizationRanking = () => {
  const apiData = [
    { rank: 1, name: "실시간 교통정보", institution: "한국도로공사", usage: 892000, change: "+15.2%" },
    { rank: 2, name: "부동산 실거래가 조회", institution: "국토교통부", usage: 756000, change: "+12.8%" },
    { rank: 3, name: "항공기 운항정보", institution: "한국공항공사", usage: 634000, change: "+8.9%" },
    { rank: 4, name: "철도 운행정보", institution: "한국철도공사", usage: 523000, change: "+6.4%" },
    { rank: 5, name: "버스 도착정보", institution: "교통안전공단", usage: 445000, change: "+10.1%" },
    { rank: 6, name: "지적도 정보", institution: "국토지리정보원", usage: 389000, change: "+5.3%" },
    { rank: 7, name: "건축물 대장정보", institution: "건축도시공간연구소", usage: 321000, change: "+7.2%" },
    { rank: 8, name: "항만 입출항 정보", institution: "해양수산부", usage: 287000, change: "+4.8%" },
    { rank: 9, name: "교통사고 통계", institution: "도로교통공단", usage: 245000, change: "+3.6%" },
    { rank: 10, name: "건설공사 정보", institution: "대한건설협회", usage: 198000, change: "+2.9%" }
  ];

  const fileData = [
    { rank: 1, name: "부동산 실거래가 데이터", institution: "국토교통부", usage: 45892, change: "+18.3%" },
    { rank: 2, name: "교통사고 통계 데이터", institution: "도로교통공단", usage: 38421, change: "+14.7%" },
    { rank: 3, name: "건축물 대장 데이터", institution: "건축도시공간연구소", usage: 32156, change: "+11.9%" },
    { rank: 4, name: "지적도 Shape 파일", institution: "국토지리정보원", usage: 28734, change: "+9.8%" },
    { rank: 5, name: "항만 물동량 통계", institution: "해양수산부", usage: 25683, change: "+8.4%" },
    { rank: 6, name: "철도역 정보 데이터", institution: "한국철도공사", usage: 22457, change: "+7.1%" },
    { rank: 7, name: "공항 시설정보", institution: "한국공항공사", usage: 19832, change: "+6.3%" },
    { rank: 8, name: "도로명 주소 데이터", institution: "행정안전부", usage: 17596, change: "+5.2%" },
    { rank: 9, name: "건설공사 현황", institution: "대한건설협회", usage: 15284, change: "+4.6%" },
    { rank: 10, name: "교통량 조사 데이터", institution: "한국도로공사", usage: 13947, change: "+3.8%" }
  ];

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">TOP {rank}</Badge>;
    }
    return <Badge variant="outline" className="font-medium">#{rank}</Badge>;
  };

  const formatUsage = (usage: number) => {
    if (usage >= 1000000) {
      return `${(usage / 1000000).toFixed(1)}M`;
    } else if (usage >= 1000) {
      return `${(usage / 1000).toFixed(1)}K`;
    }
    return usage.toLocaleString();
  };

  const DataList = ({ data, type, title }: { data: typeof apiData, type: string, title: string }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        {type === 'api' ? (
          <Database className="h-5 w-5 text-blue-600" />
        ) : (
          <Download className="h-5 w-5 text-green-600" />
        )}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getRankBadge(item.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  <Building2 className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600 truncate">{item.institution}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">{formatUsage(item.usage)}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">{item.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <span>활용도 TOP 10 (기관별)</span>
        </CardTitle>
        <p className="text-sm text-gray-600">API 호출 및 파일 다운로드 기준 상위 10개 데이터셋</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DataList data={apiData} type="api" title="API 호출 기준 TOP 10" />
          <DataList data={fileData} type="file" title="파일 다운로드 기준 TOP 10" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TopUtilizationRanking;
