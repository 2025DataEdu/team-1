
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import DataCharts from "@/components/DataCharts";
import DataTable from "@/components/DataTable";
import FilterPanel from "@/components/FilterPanel";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            국토교통부 공공데이터 현황 대시보드
          </h1>
          <p className="text-lg text-gray-600">
            공공데이터포털의 국토교통부 개방데이터를 한눈에 분석하고 탐색하세요
          </p>
        </div>

        <StatsCards />
        
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
            <DataCharts selectedCategory={selectedCategory} />
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
