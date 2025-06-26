
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

        console.log('files_downlload 데이터:', downloadData?.length, '건');
        console.log('api_call 데이터:', apiData?.length, '건');

        // 연도별 다운로드 집계
        const downloadByYear: { [key: number]: number } = {};
        (downloadData as any[])?.forEach((item: any) => {
          if (item.통계일자) {
            const year = new Date(item.통계일자).getFullYear();
            if (year >= 2020 && year <= 2024) {
              downloadByYear[year] = (downloadByYear[year] || 0) + (item["다운로드 수"] || 0);
            }
          }
        });

        // 연도별 API 호출 집계
        const apiCallByYear: { [key: number]: number } = {};
        (apiData as any[])?.forEach((item: any) => {
          if (item.통계일자) {
            const year = new Date(item.통계일자).getFullYear();
            if (year >= 2020 && year <= 2024) {
              apiCallByYear[year] = (apiCallByYear[year] || 0) + (item.호출건수 || 0);
            }
          }
        });

        console.log('연도별 다운로드 집계:', downloadByYear);
        console.log('연도별 API 호출 집계:', apiCallByYear);

        // 2020-2024년 데이터 생성
        const yearlyData = [];
        for (let year = 2020; year <= 2024; year++) {
          yearlyData.push({
            period: year.toString(),
            downloads: downloadByYear[year] || 0,
            apiCalls: apiCallByYear[year] || 0
          });
        }

        console.log('최종 연도별 데이터:', yearlyData);
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
