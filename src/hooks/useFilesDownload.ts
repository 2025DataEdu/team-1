
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFilesDownload = () => {
  return useQuery({
    queryKey: ['filesDownload'],
    queryFn: async () => {
      console.log('files_downlload 테이블 조회 시작...');
      
      const { data, error } = await supabase
        .from('files_downlload')
        .select('다운로드 수')
        .not('다운로드 수', 'is', null);
      
      if (error) {
        console.error('files_downlload 조회 오류:', error);
        throw error;
      }
      
      // 총 다운로드 수 계산
      const totalDownloads = data?.reduce((sum, item) => {
        const downloadCount = item['다운로드 수'] || 0;
        return sum + downloadCount;
      }, 0) || 0;
      
      console.log('files_downlload 데이터 조회 성공:', {
        recordCount: data?.length || 0,
        totalDownloads
      });
      
      return {
        data: data || [],
        totalDownloads
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
