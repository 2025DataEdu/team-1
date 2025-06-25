
import { Badge } from "@/components/ui/badge";
import { Calendar, Database, TrendingUp } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                공공데이터 분석 플랫폼
              </h2>
              <p className="text-sm text-gray-600">Ministry of Land, Infrastructure and Transport</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>2024년 6월 기준</span>
            </Badge>
            <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>실시간 업데이트</span>
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
