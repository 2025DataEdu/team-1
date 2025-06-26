
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFilesDownload = () => {
  return useQuery({
    queryKey: ['filesDownload'],
    queryFn: async () => {
      console.log('files_downlload 테이블 전체 조회 시작...');
      
      // 먼저 테이블의 총 레코드 수 확인
      const { count, error: countError } = await supabase
        .from('files_downlload')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('files_downlload 카운트 조회 오류:', countError);
      } else {
        console.log('files_downlload 총 레코드 수:', count);
      }
      
      // 전체 데이터 조회 (다운로드 수 컬럼만)
      const { data, error } = await supabase
        .from('files_downlload')
        .select('"다운로드 수"');
      
      if (error) {
        console.error('files_downlload 조회 오류:', error);
        throw error;
      }
      
      console.log('조회된 레코드 수:', data?.length || 0);
      
      // 총 다운로드 수 계산
      let totalDownloads = 0;
      
      if (data && data.length > 0) {
        totalDownloads = data.reduce((sum, item) => {
          const downloadCount = item['다운로드 수'] || 0;
          // 문자열인 경우 숫자로 변환
          const count = typeof downloadCount === 'string' ? parseInt(downloadCount) || 0 : downloadCount;
          return sum + count;
        }, 0);
        
        console.log('총 다운로드 수 계산 완료:', totalDownloads);
        console.log('평균 다운로드 수:', Math.round(totalDownloads / data.length));
        
        // 상위 10개 다운로드 수 확인
        const sortedDownloads = data
          .map(item => item['다운로드 수'] || 0)
          .sort((a, b) => b - a)
          .slice(0, 10);
        console.log('상위 10개 다운로드 수:', sortedDownloads);
      }
      
      console.log('files_downlload 데이터 조회 성공:', {
        totalRecords: data?.length || 0,
        totalDownloads,
        tableCount: count
      });
      
      return {
        data: data || [],
        totalDownloads,
        recordCount: data?.length || 0,
        tableCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
