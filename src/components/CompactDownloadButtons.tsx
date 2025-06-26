
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { downloadExcel, downloadPDF, DownloadData } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";

interface CompactDownloadButtonsProps {
  data: DownloadData;
}

const CompactDownloadButtons = ({ data }: CompactDownloadButtonsProps) => {
  const { toast } = useToast();

  const handleExcelDownload = async () => {
    toast({
      title: "엑셀 생성 중",
      description: "대시보드 화면을 포함한 엑셀 파일을 생성하고 있습니다.",
    });

    const success = await downloadExcel(data);
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
    <div className="flex items-center space-x-1">
      <Download className="h-4 w-4 text-gray-500" />
      <Button
        onClick={handleExcelDownload}
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs hover:bg-green-50 text-green-600"
      >
        <FileSpreadsheet className="h-3 w-3 mr-1" />
        Excel
      </Button>
      <Button
        onClick={handlePDFDownload}
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs hover:bg-red-50 text-red-600"
      >
        <FileText className="h-3 w-3 mr-1" />
        PDF
      </Button>
    </div>
  );
};

export default CompactDownloadButtons;
