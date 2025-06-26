
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useYearlyTrends = () => {
  return useQuery({
    queryKey: ['yearlyTrends'],
    queryFn: async () => {
      console.log('연도별 추이 데이터 조회 시작...');
      
      try {
        // files_downlload 테이블에서 연도별 다운로드 수 집계
        const { data: downloadData, error: downloadError } = await supabase
          .from('files_downlload')
          .select(`통계일자, "다운로드 수"`)
          .not('통계일자', 'is', null)
          .not('"다운로드 수"', 'is', null);

        if (downloadError) {
          console.error('files_downlload 조회 오류:', downloadError);
          throw downloadError;
        }

        // api_call 테이블에서 연도별 API 호출 수 집계
        const { data: apiData, error: apiError } = await supabase
          .from('api_call')
          .select('통계일자, 호출건수')
          .not('통계일자', 'is', null)
          .not('호출건수', 'is', null);

        if (apiError) {
          console.error('api_call 조회 오류:', apiError);
          throw apiError;
        }

        console.log('조회된 데이터 건수 - files_downlload:', downloadData?.length, '건, api_call:', apiData?.length, '건');

        // 연도별 다운로드 수 집계 (월별 합산)
        const downloadByYear = new Map<number, number>();
        (downloadData as any[])?.forEach((item: any) => {
          if (item.통계일자 && item["다운로드 수"]) {
            const date = new Date(item.통계일자);
            const year = date.getFullYear();
            
            // 2020-2024년 범위만 처리
            if (year >= 2020 && year <= 2024) {
              const downloadCount = parseInt(String(item["다운로드 수"])) || 0;
              const currentTotal = downloadByYear.get(year) || 0;
              downloadByYear.set(year, currentTotal + downloadCount);
            }
          }
        });

        // 연도별 API 호출 수 집계 (월별 합산)
        const apiCallByYear = new Map<number, number>();
        (apiData as any[])?.forEach((item: any) => {
          if (item.통계일자 && item.호출건수) {
            const date = new Date(item.통계일자);
            const year = date.getFullYear();
            
            // 2020-2024년 범위만 처리
            if (year >= 2020 && year <= 2024) {
              const callCount = parseInt(String(item.호출건수)) || 0;
              const currentTotal = apiCallByYear.get(year) || 0;
              apiCallByYear.set(year, currentTotal + callCount);
            }
          }
        });

        // 각 연도별 집계 결과 로그
        console.log('=== 연도별 집계 결과 ===');
        for (let year = 2020; year <= 2024; year++) {
          const downloads = downloadByYear.get(year) || 0;
          const apiCalls = apiCallByYear.get(year) || 0;
          console.log(`${year}년: 다운로드 ${downloads.toLocaleString()}건, API 호출 ${apiCalls.toLocaleString()}건`);
        }

        // 2020-2024년 연도별 데이터 생성
        const yearlyData = [];
        for (let year = 2020; year <= 2024; year++) {
          const downloads = downloadByYear.get(year) || 0;
          const apiCalls = apiCallByYear.get(year) || 0;
          
          yearlyData.push({
            period: year.toString(),
            downloads: downloads,
            apiCalls: apiCalls
          });
        }

        // 최종 데이터 확인
        console.log('=== 최종 연도별 데이터 ===');
        yearlyData.forEach(item => {
          console.log(`${item.period}년: 다운로드 ${item.downloads.toLocaleString()}, API 호출 ${item.apiCalls.toLocaleString()}`);
        });
        
        // 총합 계산
        const totalDownloads = yearlyData.reduce((sum, item) => sum + item.downloads, 0);
        const totalApiCalls = yearlyData.reduce((sum, item) => sum + item.apiCalls, 0);
        console.log(`총 다운로드: ${totalDownloads.toLocaleString()}건, 총 API 호출: ${totalApiCalls.toLocaleString()}건`);
        
        return yearlyData;

      } catch (error) {
        console.error('연도별 추이 데이터 조회 실패:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
