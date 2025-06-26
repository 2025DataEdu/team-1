
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFilesDownload = () => {
  return useQuery({
    queryKey: ['filesDownload'],
    queryFn: async () => {
      console.log('files_download 테이블 전체 레코드 수 조회 시작...');
      
      // 테이블의 총 레코드 수만 조회 (count만 필요)
      const { count, error } = await supabase
        .from('files_download')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('files_download 카운트 조회 오류:', error);
        throw error;
      }
      
      console.log('files_download 총 레코드 수:', count);
      console.log('반환할 데이터:', { totalRecords: count || 0, totalDownloads: count || 0 });
      
      return {
        totalRecords: count || 0,
        totalDownloads: count || 0 // 레코드 수 = 다운로드 수로 사용
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
