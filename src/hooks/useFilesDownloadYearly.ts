
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFilesDownloadYearly = () => {
  return useQuery({
    queryKey: ['filesDownloadYearly'],
    queryFn: async () => {
      console.log('=== files_download 연도별 데이터 수 집계 시작 ===');
      
      try {
        // files_download 테이블에서 모든 데이터 조회
        const { data: downloadData, error: downloadError } = await supabase
          .from('files_download')
          .select(`통계일자, ID`)
          .not('통계일자', 'is', null);

        if (downloadError) {
          console.error('files_download 조회 오류:', downloadError);
          throw downloadError;
        }

        console.log('files_download 총 레코드 수:', downloadData?.length || 0);
        console.log('files_download 원본 데이터 샘플:', downloadData?.slice(0, 10));

        // 연도별 데이터 수 집계
        const dataCountByYear = new Map<number, number>();
        const yearParsingErrors: any[] = [];
        
        if (downloadData && downloadData.length > 0) {
          downloadData.forEach((item: any, index: number) => {
            if (item.통계일자) {
              let year: number | null = null;
              const dateValue = item.통계일자;
              
              console.log(`[${index < 5 ? index : '...'}] 원본 통계일자:`, dateValue, '타입:', typeof dateValue);
              
              try {
                // 날짜 형식 처리 개선
                if (typeof dateValue === 'string') {
                  // YYYY-MM-DD 형식
                  if (dateValue.includes('-')) {
                    const yearStr = dateValue.split('-')[0];
                    year = parseInt(yearStr, 10);
                  } 
                  // YYYYMMDD 형식
                  else if (/^\d{8}$/.test(dateValue)) {
                    year = parseInt(dateValue.substring(0, 4), 10);
                  }
                  // YYYY 형식
                  else if (/^\d{4}$/.test(dateValue)) {
                    year = parseInt(dateValue, 10);
                  }
                  // 다른 문자열 형식들
                  else if (dateValue.length >= 4) {
                    const possibleYear = parseInt(dateValue.substring(0, 4), 10);
                    if (possibleYear >= 2000 && possibleYear <= 2030) {
                      year = possibleYear;
                    }
                  }
                } else if (dateValue instanceof Date) {
                  year = dateValue.getFullYear();
                } else {
                  // 다른 타입의 경우 Date 객체로 변환 시도
                  const date = new Date(dateValue);
                  if (!isNaN(date.getTime())) {
                    year = date.getFullYear();
                  }
                }
                
                // 연도 유효성 검사 및 집계
                if (year !== null && year >= 2020 && year <= 2024 && !isNaN(year)) {
                  const currentCount = dataCountByYear.get(year) || 0;
                  dataCountByYear.set(year, currentCount + 1);
                  
                  if (index < 5) {
                    console.log(`  -> 파싱된 연도: ${year}, 현재 카운트: ${currentCount + 1}`);
                  }
                } else {
                  if (yearParsingErrors.length < 5) {
                    yearParsingErrors.push({
                      원본값: dateValue,
                      파싱결과: year,
                      인덱스: index
                    });
                  }
                }
              } catch (parseError) {
                if (yearParsingErrors.length < 5) {
                  yearParsingErrors.push({
                    원본값: dateValue,
                    오류: parseError,
                    인덱스: index
                  });
                }
              }
            }
          });
        }

        // 파싱 오류 출력
        if (yearParsingErrors.length > 0) {
          console.log('=== 연도 파싱 오류 샘플 ===');
          yearParsingErrors.forEach(error => {
            console.log('파싱 실패:', error);
          });
        }

        // 연도별 집계 결과 출력
        console.log('=== 연도별 데이터 수 집계 결과 ===');
        for (let year = 2020; year <= 2024; year++) {
          const count = dataCountByYear.get(year) || 0;
          console.log(`${year}년: ${count.toLocaleString()}건`);
        }

        // 2020-2024년 연도별 데이터 생성
        const yearlyData = [];
        for (let year = 2020; year <= 2024; year++) {
          const count = dataCountByYear.get(year) || 0;
          
          yearlyData.push({
            year: year.toString(),
            count: count
          });
        }

        console.log('=== 최종 연도별 데이터 수 집계 ===');
        yearlyData.forEach(item => {
          console.log(`${item.year}년: ${item.count.toLocaleString()}건`);
        });
        
        // 총합 확인
        const totalCount = yearlyData.reduce((sum, item) => sum + item.count, 0);
        console.log(`5년간 총 데이터 수: ${totalCount.toLocaleString()}건`);
        
        // 0건인 연도 확인
        const zeroYears = yearlyData.filter(item => item.count === 0);
        if (zeroYears.length > 0) {
          console.log('데이터가 0건인 연도들:', zeroYears.map(item => item.year));
        }
        
        return yearlyData;

      } catch (error) {
        console.error('연도별 데이터 수 집계 실패:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
