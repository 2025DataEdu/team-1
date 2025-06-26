
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { downloadExcel, downloadPDF, DownloadData } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";

interface DownloadButtonsProps {
  data: DownloadData;
}

const DownloadButtons = ({ data }: DownloadButtonsProps) => {
  const { toast } = useToast();

  const handleExcelDownload = () => {
    const success = downloadExcel(data);
    if (success) {
      toast({
        title: "다운로드 완료",
        description: "엑셀 파일이 성공적으로 다운로드되었습니다.",
      });
    } else {
      toast({
        title: "다운로드 실패",
        description: "엑셀 파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handlePDFDownload = async () => {
    toast({
      title: "PDF 생성 중",
      description: "PDF 파일을 생성하고 있습니다. 잠시만 기다려주세요.",
    });

    const success = await downloadPDF('dashboard-content', data);
    if (success) {
      toast({
        title: "다운로드 완료",
        description: "PDF 파일이 성공적으로 다운로드되었습니다.",
      });
    } else {
      toast({
        title: "다운로드 실패",
        description: "PDF 파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">리포트 다운로드</h3>
              <p className="text-xs text-gray-600">현재 대시보드 데이터를 파일로 저장</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleExcelDownload}
              variant="outline"
              size="sm"
              className="bg-green-50 border-green-300 hover:bg-green-100 text-green-700"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button
              onClick={handlePDFDownload}
              variant="outline"
              size="sm"
              className="bg-red-50 border-red-300 hover:bg-red-100 text-red-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadButtons;
