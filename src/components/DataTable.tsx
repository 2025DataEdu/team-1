
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Calendar, ExternalLink } from "lucide-react";
import { usePublicData } from "@/hooks/usePublicDataAPI";
import { getDataStatus } from "@/utils/dataStatusUtils";

interface DataTableProps {
  selectedCategory: string;
  searchTerm: string;
}

interface ProcessedDataItem {
  id: string;
  title: string;
  category: string;
  provider: string;
  updateDate: string;
  downloads: number;
  views: number;
  format: string;
  status: string;
  dataStatus: ReturnType<typeof getDataStatus>;
  nextRegistrationDate: string;
}

const DataTable = ({ selectedCategory, searchTerm }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: apiData, isLoading, error } = usePublicData();

  // API 데이터를 UI에 맞게 변환
  const processedData: ProcessedDataItem[] = apiData?.data?.map((item) => {
    const createdAt = item.registDt || item.created_at || '';
    const nextRegDate = item.next_registration_date || '없음';
    const dataStatus = getDataStatus(createdAt, nextRegDate);
    
    return {
      id: item.datasetId || Math.random().toString(),
      title: item.datasetNm || '데이터셋명 없음',
      category: item.categoryNm || '기타',
      provider: item.providerNm || '제공기관 없음',
      updateDate: createdAt ? createdAt.split(' ')[0] : '날짜 없음',
      downloads: item.downloadCnt || 0,
      views: item.inquiryCnt || 0,
      format: item.dataFormat || 'JSON',
      status: item.serviceStts === '서비스' ? '서비스중' : item.serviceStts || '알 수 없음',
      dataStatus,
      nextRegistrationDate: nextRegDate
    };
  }) || [];

  // 국토교통부 데이터만 필터링 - 데이터셋명이 '국토교통부_' 또는 '국토교통부 '로 시작하는 경우
  const filteredByMinistry = processedData.filter(item => 
    item.title.startsWith('국토교통부_') || item.title.startsWith('국토교통부 ')
  );

  // 카테고리와 검색어로 필터링
  const filteredData = filteredByMinistry.filter(item => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    // Sort by updateDate in descending order (most recent first)
    return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime();
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "서비스중":
        return <Badge className="bg-green-100 text-green-800">서비스중</Badge>;
      case "준비중":
        return <Badge className="bg-yellow-100 text-yellow-800">준비중</Badge>;
      case "중단":
        return <Badge className="bg-red-100 text-red-800">중단</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">
            국토교통부 최신 등록 데이터셋 ({filteredData.length.toLocaleString()}건)
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              전체 다운로드
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              API 문서
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">데이터셋명</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">카테고리</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">제공기관</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">등록일</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">다운로드</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">조회수</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">형식</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">상태</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">갱신상태</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    {item.nextRegistrationDate && item.nextRegistrationDate !== '없음' && (
                      <div className="text-xs text-gray-500 mt-1">
                        차기갱신: {item.nextRegistrationDate}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{item.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.provider}</td>
                  <td className="py-3 px-4 text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {item.updateDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Download className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{item.downloads.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{item.views.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{item.format}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={`${item.dataStatus.bgColor} ${item.dataStatus.color}`}>
                      {item.dataStatus.label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            {startIndex + 1}-{Math.min(endIndex, filteredData.length)} / {filteredData.length}건 표시
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
