
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DownloadData {
  stats: {
    totalDatasets: number;
    totalDownloads: number;
    totalApiCalls: number;
  };
  categoryData: Array<{
    name: string;
    count: number;
  }>;
  yearlyTrend: Array<{
    year: string;
    downloads: number;
    apiCalls: number;
  }>;
  tableData: Array<{
    목록명: string;
    담당부서: string;
    목록타입: string;
    분류체계: string;
    등록일: string;
    마지막수정일: string;
  }>;
  topUtilization: {
    api: Array<{
      rank: number;
      name: string;
      institution: string;
      usage: number;
      change: string;
    }>;
    file: Array<{
      rank: number;
      name: string;
      institution: string;
      usage: number;
      change: string;
    }>;
  };
}

// Base64 이미지를 엑셀에 삽입하기 위한 헬퍼 함수
const addImageToWorksheet = (worksheet: XLSX.WorkSheet, imageBase64: string, cellRef: string = 'A5') => {
  try {
    // 엑셀에서 이미지를 직접 삽입하는 것은 XLSX 라이브러리의 제한으로 인해 어려우므로
    // 이미지 데이터를 셀에 텍스트로 저장하고 사용자에게 안내
    const imageInfo = [
      ['=== 대시보드 캡처 이미지 ==='],
      ['아래 이미지 데이터를 복사하여 이미지 파일로 저장한 후,'],
      ['Excel의 삽입 > 그림 기능을 통해 추가하시기 바랍니다.'],
      [''],
      ['이미지 데이터 (Base64):'],
      [imageBase64.substring(0, 100) + '...'], // 너무 길어서 축약
      [''],
      ['전체 이미지 데이터는 별도 파일로 저장됩니다.']
    ];
    
    // 기존 데이터에 이미지 정보 추가
    const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    const newData = [...existingData, ...imageInfo];
    
    // 워크시트 업데이트
    const newWorksheet = XLSX.utils.aoa_to_sheet(newData);
    return newWorksheet;
  } catch (error) {
    console.error('이미지 추가 오류:', error);
    return worksheet;
  }
};

export const downloadExcel = async (data: DownloadData) => {
  try {
    const workbook = XLSX.utils.book_new();

    // 1. 대시보드 스크린샷 생성 및 별도 파일로 저장
    const dashboardElement = document.getElementById('dashboard-content');
    let imageBase64 = '';
    
    if (dashboardElement) {
      try {
        // 스크롤을 맨 위로 이동
        window.scrollTo(0, 0);
        
        // 더 높은 해상도로 캡처
        const canvas = await html2canvas(dashboardElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: dashboardElement.scrollWidth,
          height: dashboardElement.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: '#ffffff'
        });

        imageBase64 = canvas.toDataURL('image/png');
        
        // 이미지를 별도 파일로 다운로드
        const link = document.createElement('a');
        link.download = `국토교통부_대시보드_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = imageBase64;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 대시보드 정보를 첫 번째 시트에 추가
        const dashboardData = [
          ['국토교통부 공공데이터 현황 대시보드'],
          ['생성일시: ' + new Date().toLocaleString('ko-KR')],
          [''],
          ['✅ 대시보드 화면 이미지가 별도 PNG 파일로 다운로드되었습니다.'],
          ['   파일명: 국토교통부_대시보드_' + new Date().toISOString().slice(0, 10) + '.png'],
          [''],
          ['📋 이 엑셀 파일에는 다음 데이터가 포함되어 있습니다:'],
          ['   - 통계 요약'],
          ['   - 분류체계별 데이터'],
          ['   - 연간 추이'],
          ['   - 데이터셋 목록'],
          ['   - API 활용도 TOP 10'],
          ['   - 파일 다운로드 TOP 10'],
          [''],
          ['💡 PNG 이미지 파일을 Excel에 삽입하려면:'],
          ['   1. Excel에서 삽입 > 그림 선택'],
          ['   2. 다운로드된 PNG 파일 선택'],
          ['   3. 원하는 위치에 배치']
        ];
        
        const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardData);
        
        // 셀 스타일링을 위한 열 너비 설정
        dashboardSheet['!cols'] = [{ width: 60 }];
        
        XLSX.utils.book_append_sheet(workbook, dashboardSheet, '대시보드_정보');

      } catch (error) {
        console.error('스크린샷 생성 오류:', error);
        // 스크린샷 실패 시 기본 정보만 추가
        const fallbackData = [
          ['국토교통부 공공데이터 현황 대시보드'],
          ['생성일시: ' + new Date().toLocaleString('ko-KR')],
          [''],
          ['❌ 대시보드 화면 캡처에 실패했습니다.'],
          ['   수동으로 화면을 캡처하여 추가하시기 바랍니다.']
        ];
        const fallbackSheet = XLSX.utils.aoa_to_sheet(fallbackData);
        XLSX.utils.book_append_sheet(workbook, fallbackSheet, '대시보드_정보');
      }
    }

    // 2. 통계 시트
    const statsData = [
      ['항목', '값'],
      ['총 데이터셋 수', data.stats.totalDatasets],
      ['총 다운로드 수', data.stats.totalDownloads],
      ['총 API 호출 수', data.stats.totalApiCalls]
    ];
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, '통계');

    // 3. 분류체계별 데이터 시트
    const categoryHeaders = ['분류체계', '데이터셋 수'];
    const categoryRows = data.categoryData.map(item => [item.name, item.count]);
    const categoryData = [categoryHeaders, ...categoryRows];
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, '분류체계별_데이터');

    // 4. 연간 추이 시트
    const trendHeaders = ['연도', '다운로드 수', 'API 호출 수'];
    const trendRows = data.yearlyTrend.map(item => [item.year, item.downloads, item.apiCalls]);
    const trendData = [trendHeaders, ...trendRows];
    const trendSheet = XLSX.utils.aoa_to_sheet(trendData);
    XLSX.utils.book_append_sheet(workbook, trendSheet, '연간_추이');

    // 5. 데이터셋 목록 시트
    const tableHeaders = ['목록명', '담당부서', '목록타입', '분류체계', '등록일', '마지막수정일'];
    const tableRows = data.tableData.map(item => [
      item.목록명, item.담당부서, item.목록타입, item.분류체계, item.등록일, item.마지막수정일
    ]);
    const tableSheetData = [tableHeaders, ...tableRows];
    const tableSheet = XLSX.utils.aoa_to_sheet(tableSheetData);
    XLSX.utils.book_append_sheet(workbook, tableSheet, '데이터셋_목록');

    // 6. API 활용도 TOP 10 시트
    const apiTopHeaders = ['순위', '데이터명', '기관명', '호출수', '증가율'];
    const apiTopRows = data.topUtilization.api.map(item => [
      item.rank, item.name, item.institution, item.usage, item.change
    ]);
    const apiTopData = [apiTopHeaders, ...apiTopRows];
    const apiTopSheet = XLSX.utils.aoa_to_sheet(apiTopData);
    XLSX.utils.book_append_sheet(workbook, apiTopSheet, 'API_활용도_TOP10');

    // 7. 파일 다운로드 TOP 10 시트
    const fileTopHeaders = ['순위', '데이터명', '기관명', '다운로드수', '증가율'];
    const fileTopRows = data.topUtilization.file.map(item => [
      item.rank, item.name, item.institution, item.usage, item.change
    ]);
    const fileTopData = [fileTopHeaders, ...fileTopRows];
    const fileTopSheet = XLSX.utils.aoa_to_sheet(fileTopData);
    XLSX.utils.book_append_sheet(workbook, fileTopSheet, '파일_다운로드_TOP10');

    // 파일 다운로드
    const fileName = `국토교통부_공공데이터_현황_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    return true;
  } catch (error) {
    console.error('Excel 다운로드 오류:', error);
    return false;
  }
};

export const downloadPDF = async (elementId: string, data: DownloadData) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('PDF로 변환할 요소를 찾을 수 없습니다.');
    }

    // 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // 첫 페이지 추가
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 추가 페이지가 필요한 경우
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `국토교통부_공공데이터_현황_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('PDF 다운로드 오류:', error);
    return false;
  }
};
