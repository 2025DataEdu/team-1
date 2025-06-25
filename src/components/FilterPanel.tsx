
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const FilterPanel = ({ 
  selectedCategory, 
  setSelectedCategory, 
  searchTerm, 
  setSearchTerm 
}: FilterPanelProps) => {
  const categories = [
    { name: "전체", count: 1247 },
    { name: "교통정보", count: 287 },
    { name: "부동산", count: 195 },
    { name: "건설", count: 158 },
    { name: "항공", count: 142 },
    { name: "철도", count: 125 },
    { name: "해운", count: 98 },
    { name: "기타", count: 242 }
  ];

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>필터 및 검색</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="데이터셋 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">카테고리</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "ghost"}
                className="w-full justify-between text-left"
                onClick={() => setSelectedCategory(category.name)}
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">활용도 순위</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">1. 실시간 교통정보</span>
              <Badge className="bg-red-100 text-red-800">HOT</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">2. 부동산 실거래가</span>
              <Badge className="bg-orange-100 text-orange-800">인기</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">3. 건축물 대장</span>
              <Badge className="bg-blue-100 text-blue-800">추천</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
