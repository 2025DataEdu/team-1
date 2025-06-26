
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useYearlyTrends = () => {
  return useQuery({
    queryKey: ['yearlyTrends'],
    queryFn: async () => {
      console.log('=== API 호출 연간 추이 데이터 조회 시작 ===');
      
      try {
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

        console.log('api_call 원본 데이터 샘플:', apiData?.slice(0, 5));
        console.log('api_call 총 레코드 수:', apiData?.length || 0);

        // 연도별 API 호출 수 집계
        const apiCallByYear = new Map<number, number>();
        if (apiData && apiData.length > 0) {
          apiData.forEach((item: any) => {
            if (item.통계일자 && item.호출건수) {
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
                const callCount = parseInt(String(item.호출건수)) || 0;
                if (callCount > 0) {
                  const currentTotal = apiCallByYear.get(year) || 0;
                  apiCallByYear.set(year, currentTotal + callCount);
                }
              }
            }
          });
        }

        // 연도별 집계 결과 출력
        console.log('=== 연도별 API 호출 집계 결과 ===');
        for (let year = 2020; year <= 2024; year++) {
          const apiCalls = apiCallByYear.get(year) || 0;
          console.log(`${year}년: API 호출 ${apiCalls.toLocaleString()}건`);
        }

        // 2020-2024년 연도별 데이터 생성 (API 호출만)
        const yearlyData = [];
        for (let year = 2020; year <= 2024; year++) {
          const apiCalls = apiCallByYear.get(year) || 0;
          
          yearlyData.push({
            period: year.toString(),
            apiCalls: apiCalls
          });
        }

        console.log('=== 최종 연간 API 호출 추이 데이터 ===');
        yearlyData.forEach(item => {
          console.log(`${item.period}년: API 호출 ${item.apiCalls.toLocaleString()}건`);
        });
        
        // 총합 확인
        const totalApiCalls = yearlyData.reduce((sum, item) => sum + item.apiCalls, 0);
        console.log(`5년간 총 API 호출: ${totalApiCalls.toLocaleString()}건`);
        
        return yearlyData;

      } catch (error) {
        console.error('연도별 API 호출 추이 데이터 조회 실패:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
