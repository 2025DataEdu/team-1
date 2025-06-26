
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import DataCharts from "@/components/DataCharts";
import DataTable from "@/components/DataTable";
import FilterPanel from "@/components/FilterPanel";
import TopUtilizationRanking from "@/components/TopUtilizationRanking";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">국토교통부 공공데이터 현황</h1>
          <p className="text-lg text-gray-600">공공데이터포털에 등록된 국토교통부 개방데이터의 현황 및 활용도를 한 눈에 확인할 수 있습니다.</p>
        </div>

        <StatsCards />
        
        {/* 월별 데이터셋 및 활용 현황 추이를 StatsCards 아래로 이동 */}
        <DataCharts selectedCategory={selectedCategory} />
        
        {/* 챗봇 검색창 */}
        <ChatBot />
        
        <TopUtilizationRanking />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <DataTable 
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
