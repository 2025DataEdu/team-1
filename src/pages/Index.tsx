
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

        {/* 상단 3개 카드 - 공공데이터 수, 활용현황, 갱신현황 */}
        <StatsCards />
        
        {/* 중간 2개 카드 - 분류체계별 데이터 + 연간 추이 */}
        <DataCharts selectedCategory={selectedCategory} />
        
        {/* 하단 좌측 사이드바 + 우측 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 좌측 사이드바 - 보류목록 + 필터 */}
          <div className="lg:col-span-1 space-y-6">
            <FilterPanel 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          
          {/* 우측 메인 콘텐츠 - 국토교통부 최신 등록 데이터셋 */}
          <div className="lg:col-span-3 space-y-6">
            <DataTable 
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
            />
          </div>
        </div>
        
        {/* 하단 활용도 TOP 10 */}
        <TopUtilizationRanking />
        
        {/* 챗봇 검색창 */}
        <ChatBot />
      </div>
    </div>
  );
};

export default Index;
