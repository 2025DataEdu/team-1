
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Download, Eye, FileText } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "총 데이터셋",
      value: "1,247",
      change: "+12.5%",
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "활용 건수",
      value: "45,829",
      change: "+18.3%",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "다운로드",
      value: "23,567",
      change: "+25.1%",
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "API 호출",
      value: "892K",
      change: "+31.2%",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-green-600 mt-1">
              <span className="font-medium">{stat.change}</span> 전월 대비
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
