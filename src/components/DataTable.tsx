
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, FileText } from "lucide-react";
import { useOpenData } from "@/hooks/useOpenData";

interface DataTableProps {
  selectedCategory: string;
  searchTerm: string;
}

interface ProcessedDataItem {
  id: string;
  목록명: string;
  목록타입: string;
  담당부서: string;
  등록일: string;
  마지막수정일: string;
  분류체계: string;
}

const DataTable = ({ selectedCategory, searchTerm }: DataTableProps) => {
  const { data: supabaseData, isLoading, error } = useOpenData();

  // Supabase 데이터를 UI에 맞게 변환하고 필터링
  const processedData: ProcessedDataItem[] = supabaseData?.data
    ?.map((item) => ({
      id: item.ID?.toString() || Math.random().toString(),
      목록명: (item.목록명 || '목록명 없음').replace(/^국토교통부_/, ''), // '국토교통부_' 제거
      목록타입: item.목록타입 || '타입 없음',
      담당부서: item.담당부서 || '담당부서 없음',
      등록일: item.등록일 ? new Date(item.등록일).toLocaleDateString() : '날짜 없음',
      마지막수정일: item.마지막수정일 ? new Date(item.마지막수정일).toLocaleDateString() : '날짜 없음',
      분류체계: item.분류체계 || '기타'
    }))
    ?.filter(item => {
      // 카테고리 필터링
      if (selectedCategory !== '전체' && item.분류체계 !== selectedCategory) {
        return false;
      }
      
      // 검색어 필터링
      if (searchTerm) {
        const matchesSearch = item.목록명.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.담당부서.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      }
      
      return true;
    })
    ?.sort((a, b) => {
      // 마지막수정일 기준으로 내림차순 정렬 (최신순)
      const dateA = new Date(a.마지막수정일);
      const dateB = new Date(b.마지막수정일);
      return dateB.getTime() - dateA.getTime();
    })
    ?.slice(0, 15) || []; // 15개로 증가

  console.log('DataTable - 처리된 데이터 수:', processedData.length);
  console.log('DataTable - 선택된 카테고리:', selectedCategory);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-lg text-red-600">데이터를 불러오는데 실패했습니다.</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          최신 등록 데이터셋 
          <span className="text-sm font-normal text-gray-500">
            ({selectedCategory === '전체' ? '전체' : selectedCategory})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="space-y-3">
            {processedData.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 leading-tight">
                      {item.목록명}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{item.담당부서}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.목록타입}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          item.분류체계 === '교통물류' ? 'bg-blue-100 text-blue-800' :
                          item.분류체계 === '국토관리' ? 'bg-green-100 text-green-800' :
                          item.분류체계 === '산업고용' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.분류체계}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>등록: {item.등록일}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>수정: {item.마지막수정일}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {processedData.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm ? '검색 조건에 맞는 데이터가 없습니다.' : 
               selectedCategory === '전체' ? '데이터가 없습니다.' : 
               `${selectedCategory} 분류의 데이터가 없습니다.`}
            </div>
            {searchTerm && (
              <div className="text-gray-400 text-sm">
                다른 검색어를 시도해보세요.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
