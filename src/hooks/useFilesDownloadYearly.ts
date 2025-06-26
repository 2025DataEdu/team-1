
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
        console.log('files_download 원본 데이터 샘플:', downloadData?.slice(0, 5));

        // 연도별 데이터 수 집계
        const dataCountByYear = new Map<number, number>();
        
        if (downloadData && downloadData.length > 0) {
          downloadData.forEach((item: any) => {
            if (item.통계일자) {
              let year: number;
              const dateValue = item.통계일자;
              
              // 날짜 형식 처리
              if (typeof dateValue === 'string') {
                if (dateValue.includes('-')) {
                  year = parseInt(dateValue.split('-')[0]);
                } else if (dateValue.length >= 4) {
                  year = parseInt(dateValue.substring(0, 4));
                } else {
                  return;
                }
              } else if (dateValue instanceof Date) {
                year = dateValue.getFullYear();
              } else {
                const date = new Date(dateValue);
                year = date.getFullYear();
              }
              
              if (year >= 2020 && year <= 2024 && !isNaN(year)) {
                const currentCount = dataCountByYear.get(year) || 0;
                dataCountByYear.set(year, currentCount + 1);
              }
            }
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
