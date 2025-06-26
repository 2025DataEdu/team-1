
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";
import { useOpenDataCategories } from "@/hooks/useOpenDataCategories";

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const FilterPanel = ({ 
  selectedCategory, 
  setSelectedCategory 
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

  // 상위 8개 카테고리만 표시 (전체 포함)
  const displayCategories = categories.slice(0, 9); // 전체 + 상위 8개

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>필터</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">분류체계</h3>
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {displayCategories.map((category) => (
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
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
