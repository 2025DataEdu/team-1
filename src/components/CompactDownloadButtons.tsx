
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
      title: "엑셀 및 이미지 생성 중",
      description: "대시보드 이미지(PNG)와 엑셀 파일을 동시에 생성하고 있습니다.",
    });

    const success = await downloadExcel(data);
    if (success) {
      toast({
        title: "다운로드 완료",
        description: "엑셀 파일과 대시보드 이미지(PNG)가 성공적으로 다운로드되었습니다. PNG 파일을 엑셀에 직접 삽입하실 수 있습니다.",
        duration: 5000,
      });
    } else {
      toast({
        title: "다운로드 실패",
        description: "파일 다운로드 중 오류가 발생했습니다.",
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
        title="엑셀 파일과 대시보드 이미지(PNG)를 함께 다운로드합니다"
      >
        <FileSpreadsheet className="h-3 w-3 mr-1" />
        Excel+PNG
      </Button>
      <Button
        onClick={handlePDFDownload}
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs hover:bg-red-50 text-red-600"
        title="대시보드를 PDF 파일로 다운로드합니다"
      >
        <FileText className="h-3 w-3 mr-1" />
        PDF
      </Button>
    </div>
  );
};

export default CompactDownloadButtons;
