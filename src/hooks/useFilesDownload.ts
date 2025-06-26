
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFilesDownload = () => {
  return useQuery({
    queryKey: ['filesDownload'],
    queryFn: async () => {
      console.log('files_downlload 테이블 조회 시작...');
      
      // 먼저 모든 컬럼을 가져와서 실제 컬럼명 확인
      const { data: allData, error: allError } = await supabase
        .from('files_downlload')
        .select('*')
        .limit(1);
      
      if (allError) {
        console.error('files_downlload 전체 조회 오류:', allError);
      } else {
        console.log('files_downlload 컬럼 확인:', allData?.[0] ? Object.keys(allData[0]) : 'No data');
      }
      
      // 다운로드 수 컬럼을 찾기 위한 여러 시도
      let downloadData;
      let error;
      
      // 첫 번째 시도: "다운로드 수"
      try {
        const result = await supabase
          .from('files_downlload')
          .select('"다운로드 수"')
          .not('"다운로드 수"', 'is', null);
        
        if (!result.error) {
          downloadData = result.data;
          console.log('컬럼명 "다운로드 수"로 성공');
        } else {
          throw result.error;
        }
      } catch (err) {
        console.log('컬럼명 "다운로드 수" 실패:', err);
        
        // 두 번째 시도: "다운로드수"
        try {
          const result = await supabase
            .from('files_downlload')
            .select('다운로드수')
            .not('다운로드수', 'is', null);
          
          if (!result.error) {
            downloadData = result.data;
            console.log('컬럼명 "다운로드수"로 성공');
          } else {
            throw result.error;
          }
        } catch (err2) {
          console.log('컬럼명 "다운로드수" 실패:', err2);
          
          // 세 번째 시도: 전체 데이터에서 다운로드 관련 컬럼 찾기
          const { data: fullData, error: fullError } = await supabase
            .from('files_downlload')
            .select('*')
            .limit(100);
          
          if (fullError) {
            error = fullError;
          } else {
            downloadData = fullData;
            console.log('전체 데이터로 조회 성공');
          }
        }
      }
      
      if (error) {
        console.error('files_downlload 조회 오류:', error);
        throw error;
      }
      
      // 총 다운로드 수 계산
      let totalDownloads = 0;
      
      if (downloadData && downloadData.length > 0) {
        // 다운로드 관련 컬럼을 찾아서 합계 계산
        const firstRow = downloadData[0];
        const downloadColumn = Object.keys(firstRow).find(key => 
          key.includes('다운로드') || key.toLowerCase().includes('download')
        );
        
        console.log('찾은 다운로드 컬럼:', downloadColumn);
        
        if (downloadColumn) {
          totalDownloads = downloadData.reduce((sum, item) => {
            const downloadCount = item[downloadColumn] || 0;
            return sum + (typeof downloadCount === 'string' ? parseInt(downloadCount) || 0 : downloadCount);
          }, 0);
        }
      }
      
      console.log('files_downlload 데이터 조회 성공:', {
        recordCount: downloadData?.length || 0,
        totalDownloads
      });
      
      return {
        data: downloadData || [],
        totalDownloads
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
