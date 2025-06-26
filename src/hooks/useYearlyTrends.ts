
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

        // API 호출 데이터의 연도별 분포 확인
        const apiYearDistribution: { [key: number]: number } = {};
        (apiData as any[])?.forEach((item: any) => {
          if (item.통계일자) {
            const year = new Date(item.통계일자).getFullYear();
            apiYearDistribution[year] = (apiYearDistribution[year] || 0) + 1;
          }
        });
        console.log('API 호출 데이터 연도별 레코드 수:', apiYearDistribution);

        // 다운로드 데이터의 연도별 분포 확인
        const downloadYearDistribution: { [key: number]: number } = {};
        (downloadData as any[])?.forEach((item: any) => {
          if (item.통계일자) {
            const year = new Date(item.통계일자).getFullYear();
            downloadYearDistribution[year] = (downloadYearDistribution[year] || 0) + 1;
          }
        });
        console.log('다운로드 데이터 연도별 레코드 수:', downloadYearDistribution);

        // 연도별 다운로드 집계
        const downloadByYear: { [key: number]: number } = {};
        (downloadData as any[])?.forEach((item: any) => {
          if (item.통계일자) {
            const year = new Date(item.통계일자).getFullYear();
            if (year >= 2020 && year <= 2024) {
              const downloadCount = parseInt(item["다운로드 수"]) || 0;
              downloadByYear[year] = (downloadByYear[year] || 0) + downloadCount;
            }
          }
        });

        // 연도별 API 호출 집계
        const apiCallByYear: { [key: number]: number } = {};
        (apiData as any[])?.forEach((item: any) => {
          if (item.통계일자) {
            const year = new Date(item.통계일자).getFullYear();
            if (year >= 2020 && year <= 2024) {
              const callCount = parseInt(item.호출건수) || 0;
              apiCallByYear[year] = (apiCallByYear[year] || 0) + callCount;
            }
          }
        });

        console.log('연도별 다운로드 집계:', downloadByYear);
        console.log('연도별 API 호출 집계:', apiCallByYear);

        // API 호출 데이터에서 상위 몇 개 레코드 확인
        const topApiCalls = (apiData as any[])?.slice(0, 5).map(item => ({
          통계일자: item.통계일자,
          호출건수: item.호출건수,
          목록명: item.목록명
        }));
        console.log('API 호출 상위 5개 레코드:', topApiCalls);

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
        
        // 총합 확인
        const totalDownloads = Object.values(downloadByYear).reduce((sum, val) => sum + val, 0);
        const totalApiCalls = Object.values(apiCallByYear).reduce((sum, val) => sum + val, 0);
        console.log('총 다운로드 수:', totalDownloads);
        console.log('총 API 호출 수:', totalApiCalls);
        
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
