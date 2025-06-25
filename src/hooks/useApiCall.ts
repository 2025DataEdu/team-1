
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useApiCall = () => {
  return useQuery({
    queryKey: ['apiCall'],
    queryFn: async () => {
      console.log('Supabase에서 api_call 데이터 조회 시작...');
      
      const { data, error, count } = await supabase
        .from('api_call')
        .select('*', { count: 'exact' });
      
      if (error) {
        console.error('Supabase api_call 조회 오류:', error);
        throw error;
      }
      
      console.log('Supabase api_call 데이터 조회 성공:', { dataLength: data?.length, totalCount: count });
      
      return {
        data: data || [],
        totalCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
