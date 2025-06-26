import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { useOpenData } from "@/hooks/useOpenData";

interface DataTableProps {
  selectedCategory: string;
  searchTerm: string;
}

interface ProcessedDataItem {
  id: string;
  목록명: string;
  담당부서: string;
  목록타입: string;
  분류체계: string;
  등록일: string;
  마지막수정일: string;
  등록일_원본: Date;
  마지막수정일_원본: Date;
}

const DataTable = ({ selectedCategory, searchTerm }: DataTableProps) => {
  const { data: supabaseData, isLoading, error } = useOpenData();

  // Supabase 데이터를 UI에 맞게 변환하고 필터링
  const processedData: ProcessedDataItem[] = supabaseData?.data
    ?.map((item) => ({
      id: item.ID?.toString() || Math.random().toString(),
      목록명: (item.목록명 || '목록명 없음').replace(/^국토교통부[_\s]*/, ''),
      담당부서: item.담당부서 || '담당부서 없음',
      목록타입: item.목록타입 || '타입 없음',
      분류체계: item.분류체계 || '기타',
      등록일: item.등록일 ? new Date(item.등록일).toLocaleDateString() : '날짜 없음',
      마지막수정일: item.마지막수정일 ? new Date(item.마지막수정일).toLocaleDateString() : '날짜 없음',
      등록일_원본: item.등록일 ? new Date(item.등록일) : new Date(0),
      마지막수정일_원본: item.마지막수정일 ? new Date(item.마지막수정일) : new Date(0)
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
      // 마지막수정일 기준으로 내림차순 정렬
      const dateCompare = b.마지막수정일_원본.getTime() - a.마지막수정일_원본.getTime();
      
      // 마지막수정일이 같으면 등록일 기준으로 내림차순 정렬
      if (dateCompare === 0) {
        return b.등록일_원본.getTime() - a.등록일_원본.getTime();
      }
      
      return dateCompare;
    })
    ?.slice(0, 10) || []; // 10개로 제한

  console.log('DataTable - 처리된 데이터 수:', processedData.length);
  console.log('DataTable - 선택된 카테고리:', selectedCategory);

  if (isLoading) {
    return (
      <Card className="sticky top-6 h-[520px]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="sticky top-6 h-[520px]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-red-600">데이터를 불러오는데 실패했습니다.</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm sticky top-6 h-[520px] flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          국토교통부 최신 등록 데이터셋 (상위 10개)
          <span className="text-sm font-normal text-gray-500">
            ({selectedCategory === '전체' ? '전체' : selectedCategory})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {processedData.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2 font-bold">
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
        ) : (
          <div className="h-full flex flex-col rounded-lg border border-gray-200 overflow-hidden">
            {/* 고정 헤더 */}
            <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200">
              <div className="flex">
                <div className="font-bold text-gray-700 py-4 px-6 text-center w-[45%] border-r border-gray-200">목록명</div>
                <div className="font-bold text-gray-700 py-4 px-4 text-center w-[17%] min-w-[130px] border-r border-gray-200">목록타입</div>
                <div className="font-bold text-gray-700 py-4 px-4 text-center w-[18%] min-w-[130px] border-r border-gray-200">분류체계</div>
                <div className="font-bold text-gray-700 py-4 px-4 text-center w-[20%] min-w-[150px]">마지막수정일</div>
              </div>
            </div>
            
            {/* 스크롤 가능한 본문 */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-gray-100">
                {processedData.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <div className="font-medium py-5 px-6 w-[45%] border-r border-gray-100">
                      <div className="truncate" title={item.목록명}>
                        {item.목록명}
                      </div>
                    </div>
                    <div className="py-5 px-4 w-[17%] min-w-[130px] border-r border-gray-100 flex items-center justify-center">
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {item.목록타입}
                      </Badge>
                    </div>
                    <div className="py-5 px-4 w-[18%] min-w-[130px] border-r border-gray-100 flex items-center justify-center">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs whitespace-nowrap ${
                          item.분류체계 === '교통물류' ? 'bg-blue-100 text-blue-800' :
                          item.분류체계 === '국토관리' ? 'bg-green-100 text-green-800' :
                          item.분류체계 === '산업고용' ? 'bg-purple-100 text-purple-800' :
                          item.분류체계 === '재난안전' ? 'bg-red-100 text-red-800' :
                          item.분류체계 === '공공행정' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.분류체계}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 py-5 px-4 w-[20%] min-w-[150px] text-center whitespace-nowrap flex items-center justify-center">
                      {item.마지막수정일}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
