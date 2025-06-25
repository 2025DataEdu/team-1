import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye, Calendar, Database, ExternalLink } from "lucide-react";

interface DataTableProps {
  selectedCategory: string;
  searchTerm: string;
}

const DataTable = ({ selectedCategory, searchTerm }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockData = [
    {
      id: 1,
      title: "스마트시티 통합 플랫폼 데이터",
      category: "스마트시티",
      provider: "국토교통부",
      updateDate: "2025-06-25",
      downloads: 28450,
      views: 67892,
      format: "JSON",
      status: "서비스중"
    },
    {
      id: 2,
      title: "자율주행차 인프라 정보",
      category: "교통정보",
      provider: "한국도로공사",
      updateDate: "2025-06-24",
      downloads: 23680,
      views: 58421,
      format: "JSON",
      status: "서비스중"
    },
    {
      id: 3,
      title: "건설현장 IoT 센서 데이터",
      category: "건설",
      provider: "한국건설기술연구원",
      updateDate: "2025-06-23",
      downloads: 19250,
      views: 45832,
      format: "JSON",
      status: "서비스중"
    },
    {
      id: 4,
      title: "친환경 건축물 인증 정보",
      category: "건설",
      provider: "한국건설기술연구원",
      updateDate: "2025-06-22",
      downloads: 17830,
      views: 42156,
      format: "XML",
      status: "서비스중"
    },
    {
      id: 5,
      title: "실시간 교통정보 (TOPIS)",
      category: "교통정보",
      provider: "한국도로공사",
      updateDate: "2025-06-21",
      downloads: 16420,
      views: 45892,
      format: "JSON",
      status: "서비스중"
    },
    {
      id: 6,
      title: "부동산 실거래가 정보",
      category: "부동산",
      provider: "국토교통부",
      updateDate: "2025-06-20",
      downloads: 15380,
      views: 38421,
      format: "XML",
      status: "서비스중"
    },
    {
      id: 7,
      title: "도시철도 혼잡도 정보",
      category: "철도",
      provider: "한국철도공사",
      updateDate: "2025-06-19",
      downloads: 14890,
      views: 35283,
      format: "JSON",
      status: "서비스중"
    },
    {
      id: 8,
      title: "항공기 운항정보",
      category: "항공",
      provider: "한국공항공사",
      updateDate: "2025-06-18",
      downloads: 12630,
      views: 31456,
      format: "XML",
      status: "서비스중"
    },
    {
      id: 9,
      title: "고속철도 운행정보",
      category: "철도",
      provider: "한국철도공사",
      updateDate: "2025-06-17",
      downloads: 11890,
      views: 29283,
      format: "JSON",
      status: "서비스중"
    },
    {
      id: 10,
      title: "항만 스마트 물류 데이터",
      category: "해운",
      provider: "해양수산부",
      updateDate: "2025-06-16",
      downloads: 10210,
      views: 26592,
      format: "CSV",
      status: "서비스중"
    },
    {
      id: 11,
      title: "건축물 대장 정보",
      category: "건설",
      provider: "건축도시공간연구소",
      updateDate: "2024-12-23",
      downloads: 8950,
      views: 27835,
      format: "JSON",
      status: "서비스중"
    },
    {
      id: 12,
      title: "교통사고 통계",
      category: "교통정보",
      provider: "도로교통공단",
      updateDate: "2024-12-21",
      downloads: 7830,
      views: 25347,
      format: "JSON",
      status: "서비스중"
    }
  ];

  const filteredData = mockData.filter(item => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">
            최신 등록 데이터셋 ({filteredData.length.toLocaleString()}건)
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
                <th className="text-left py-3 px-4 font-medium text-gray-700">최종업데이트</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">다운로드</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">조회수</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">형식</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">상태</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.title}</div>
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
