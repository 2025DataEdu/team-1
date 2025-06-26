
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMonthlyStats = () => {
  return useQuery({
    queryKey: ['monthlyStats'],
    queryFn: async () => {
      console.log('월별 통계 데이터 조회 시작...');
      
      const { data, error } = await supabase
        .from('monthly_stats')
        .select('*')
        .order('year', { ascending: true })
        .order('month', { ascending: true });
      
      if (error) {
        console.error('월별 통계 조회 오류:', error);
        throw error;
      }
      
      console.log('월별 통계 데이터 조회 성공:', data?.length, '개 레코드');
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
