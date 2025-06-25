
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
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
}

const DataTable = ({ selectedCategory, searchTerm }: DataTableProps) => {
  const { data: supabaseData, isLoading, error } = useOpenData();

  // Supabase 데이터를 UI에 맞게 변환하고 필터링
  const processedData: ProcessedDataItem[] = supabaseData?.data
    ?.filter(item => item.목록명?.startsWith('국토교통부_') || item.목록명?.startsWith('국토교통부 '))
    ?.map((item) => ({
      id: item.ID?.toString() || Math.random().toString(),
      목록명: item.목록명 || '목록명 없음',
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
      return true;
    })
    ?.sort((a, b) => {
      // 마지막수정일 기준으로 내림차순 정렬 (최신순)
      const dateA = new Date(a.마지막수정일);
      const dateB = new Date(b.마지막수정일);
      return dateB.getTime() - dateA.getTime();
    })
    ?.slice(0, 10) || []; // 최신 10개만 선택

  // 검색어로 필터링 (이미 10개로 제한된 데이터에서)
  const filteredData = processedData.filter(item => {
    const matchesSearch = item.목록명.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.담당부서.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          국토교통부 최신 등록 데이터셋 ({selectedCategory === '전체' ? '전체' : selectedCategory})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">목록명</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">목록타입</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">담당부서</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">등록일</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">마지막수정일</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.목록명}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{item.목록타입}</Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.담당부서}</td>
                  <td className="py-3 px-4 text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {item.등록일}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.마지막수정일}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">
              {selectedCategory === '전체' ? '검색 조건에 맞는 데이터가 없습니다.' : `${selectedCategory} 분류의 데이터가 없습니다.`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
