
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOpenData = () => {
  return useQuery({
    queryKey: ['openData'],
    queryFn: async () => {
      console.log('Supabase에서 openData 조회 시작...');
      
      // 모든 데이터를 가져오기 위해 페이지네이션 사용
      let allData: any[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;
      
      while (hasMore) {
        const { data, error, count } = await supabase
          .from('openData')
          .select('*', { count: 'exact' })
          .range(from, from + pageSize - 1);
        
        if (error) {
          console.error('Supabase 조회 오류:', error);
          throw error;
        }
        
        if (data) {
          allData = [...allData, ...data];
          console.log(`페이지 ${Math.floor(from / pageSize) + 1}: ${data.length}개 데이터 로드됨`);
        }
        
        // 더 이상 데이터가 없거나 받은 데이터가 페이지 크기보다 작으면 종료
        hasMore = data && data.length === pageSize;
        from += pageSize;
        
        // 안전장치: 너무 많은 반복 방지
        if (from > 10000) {
          console.warn('너무 많은 데이터 요청으로 인한 중단');
          break;
        }
      }
      
      const totalCount = allData.length;
      console.log('Supabase 데이터 조회 성공:', { dataLength: totalCount, totalCount });
      
      return {
        data: allData,
        totalCount: totalCount
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
