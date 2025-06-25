
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, FileText, Database } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "공공데이터 수",
      totalValue: "24,892",
      totalChange: "+5.2%",
      molandValue: "3,247",
      molandChange: "+8.1%",
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "활용 건수",
      totalValue: "1,247,892",
      totalChange: "+18.3%",
      molandValue: "458,291",
      molandChange: "+22.1%",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "다운로드",
      totalValue: "523,567",
      totalChange: "+25.1%",
      molandValue: "187,432",
      molandChange: "+28.7%",
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "API 호출",
      totalValue: "3.2M",
      totalChange: "+31.2%",
      molandValue: "892K",
      molandChange: "+35.8%",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const calculatePercentage = (molandValue: string, totalValue: string): string => {
    // 숫자 추출 함수
    const parseValue = (value: string): number => {
      const numStr = value.replace(/,/g, '');
      if (numStr.includes('M')) {
        return parseFloat(numStr.replace('M', '')) * 1000000;
      } else if (numStr.includes('K')) {
        return parseFloat(numStr.replace('K', '')) * 1000;
      }
      return parseFloat(numStr);
    };

    const molandNum = parseValue(molandValue);
    const totalNum = parseValue(totalValue);
    const percentage = (molandNum / totalNum * 100).toFixed(1);
    
    return `${percentage}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 공공데이터포털 전체 */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">공공데이터포털 전체</div>
              <div className="text-2xl font-bold text-gray-900">{stat.totalValue}</div>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">{stat.totalChange}</span> 전월 대비
              </p>
            </div>
            
            {/* 국토교통부 */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-700 mb-1 font-medium">국토교통부</div>
              <div className="text-2xl font-bold text-blue-900">
                {stat.molandValue} <span className="text-sm text-blue-600 font-normal">({calculatePercentage(stat.molandValue, stat.totalValue)})</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                <span className="font-medium">{stat.molandChange}</span> 전월 대비
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
