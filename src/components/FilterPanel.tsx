
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useOpenDataCategories } from "@/hooks/useOpenDataCategories";

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
  const { categories, isLoading } = useOpenDataCategories();

  if (isLoading) {
    return (
      <Card className="sticky top-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-600">카테고리 로딩 중...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <h3 className="text-sm font-medium text-gray-700 mb-3">분류체계</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "ghost"}
                className="w-full justify-between text-left"
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="truncate">{category.name}</span>
                <Badge variant="secondary" className="ml-2 flex-shrink-0">
                  {category.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
