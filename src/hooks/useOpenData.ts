
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOpenData = () => {
  return useQuery({
    queryKey: ['openData'],
    queryFn: async () => {
      console.log('Supabase에서 openData 조회 시작...');
      
      // 행 제한 없이 모든 데이터 가져오기
      const { data, error, count } = await supabase
        .from('openData')
        .select('*', { count: 'exact' });
      
      if (error) {
        console.error('Supabase 조회 오류:', error);
        throw error;
      }
      
      console.log('Supabase 데이터 조회 성공:', { dataLength: data?.length, totalCount: count });
      
      return {
        data: data || [],
        totalCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
