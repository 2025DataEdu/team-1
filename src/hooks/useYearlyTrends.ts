
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useYearlyTrends = () => {
  return useQuery({
    queryKey: ['yearlyTrends'],
    queryFn: async () => {
      console.log('=== monthly_stats 테이블에서 연간 추이 데이터 조회 시작 ===');
      
      try {
        // monthly_stats 테이블에서 연도별 API 호출 수 집계
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('monthly_stats')
          .select('year, total_api_calls')
          .not('year', 'is', null)
          .not('total_api_calls', 'is', null)
          .order('year');

        if (monthlyError) {
          console.error('monthly_stats 조회 오류:', monthlyError);
          throw monthlyError;
        }

        console.log('monthly_stats 원본 데이터:', monthlyData);
        console.log('monthly_stats 총 레코드 수:', monthlyData?.length || 0);

        // 연도별 API 호출 수 집계
        const apiCallByYear = new Map<number, number>();
        if (monthlyData && monthlyData.length > 0) {
          monthlyData.forEach((item: any) => {
            const year = item.year;
            const apiCalls = item.total_api_calls || 0;
            
            if (year >= 2020 && year <= 2024 && apiCalls > 0) {
              const currentTotal = apiCallByYear.get(year) || 0;
              apiCallByYear.set(year, currentTotal + apiCalls);
            }
          });
        }

        // 연도별 집계 결과 출력
        console.log('=== 연도별 API 호출 집계 결과 ===');
        for (let year = 2020; year <= 2024; year++) {
          const apiCalls = apiCallByYear.get(year) || 0;
          console.log(`${year}년: API 호출 ${apiCalls.toLocaleString()}건`);
        }

        // 2020-2024년 연도별 데이터 생성
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
