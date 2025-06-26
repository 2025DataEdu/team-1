
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useYearlyTrends = () => {
  return useQuery({
    queryKey: ['yearlyTrends'],
    queryFn: async () => {
      console.log('=== API 호출 연간 추이 데이터 조회 시작 ===');
      
      try {
        // files_download 테이블에서 연도별 다운로드 수 집계
        const { data: downloadData, error: downloadError } = await supabase
          .from('files_download')
          .select(`통계일자, "다운로드 수"`)
          .not('통계일자', 'is', null)
          .not('"다운로드 수"', 'is', null);

        if (downloadError) {
          console.error('files_download 조회 오류:', downloadError);
        } else {
          console.log('files_download 원본 데이터 샘플:', downloadData?.slice(0, 5));
          console.log('files_download 총 레코드 수:', downloadData?.length || 0);
        }

        // api_call 테이블에서 연도별 API 호출 수 집계
        const { data: apiData, error: apiError } = await supabase
          .from('api_call')
          .select('통계일자, 호출건수')
          .not('통계일자', 'is', null)
          .not('호출건수', 'is', null);

        if (apiError) {
          console.error('api_call 조회 오류:', apiError);
        } else {
          console.log('api_call 원본 데이터 샘플:', apiData?.slice(0, 5));
          console.log('api_call 총 레코드 수:', apiData?.length || 0);
        }

        // 연도별 다운로드 수 집계
        const downloadByYear = new Map<number, number>();
        if (downloadData && downloadData.length > 0) {
          downloadData.forEach((item: any) => {
            if (item.통계일자) {
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
                const downloadCount = parseInt(String(item["다운로드 수"])) || 0;
                if (downloadCount > 0) {
                  const currentTotal = downloadByYear.get(year) || 0;
                  downloadByYear.set(year, currentTotal + downloadCount);
                }
              }
            }
          });
        }

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
        console.log('=== 연도별 집계 결과 ===');
        for (let year = 2020; year <= 2024; year++) {
          const downloads = downloadByYear.get(year) || 0;
          const apiCalls = apiCallByYear.get(year) || 0;
          console.log(`${year}년: 다운로드 ${downloads.toLocaleString()}건, API 호출 ${apiCalls.toLocaleString()}건`);
        }

        // 2020-2024년 연도별 데이터 생성
        const yearlyData = [];
        for (let year = 2020; year <= 2024; year++) {
          const downloads = downloadByYear.get(year) || 0;
          const apiCalls = apiCallByYear.get(year) || 0;
          
          yearlyData.push({
            period: year.toString(),
            downloads: downloads,
            apiCalls: apiCalls
          });
        }

        console.log('=== 최종 연간 추이 데이터 ===');
        yearlyData.forEach(item => {
          console.log(`${item.period}년: 다운로드 ${item.downloads.toLocaleString()}, API 호출 ${item.apiCalls.toLocaleString()}`);
        });
        
        // 총합 확인
        const totalDownloads = yearlyData.reduce((sum, item) => sum + item.downloads, 0);
        const totalApiCalls = yearlyData.reduce((sum, item) => sum + item.apiCalls, 0);
        console.log(`5년간 총합 - 다운로드: ${totalDownloads.toLocaleString()}건, API 호출: ${totalApiCalls.toLocaleString()}건`);
        
        return yearlyData;

      } catch (error) {
        console.error('연도별 추이 데이터 조회 실패:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
