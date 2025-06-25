
import { useQuery } from '@tanstack/react-query';

interface PublicDataItem {
  datasetNm: string;
  categoryNm: string;
  providerNm: string;
  updateCycle: string;
  dataFormat: string;
  downloadCnt: number;
  inquiryCnt: number;
  registDt: string;
  serviceStts: string;
  datasetId: string;
}

interface PublicDataResponse {
  data: PublicDataItem[];
  currentCount: number;
  totalCount: number;
}

const API_BASE_URL = 'https://api.odcloud.kr/api';
const API_KEY = '0z1vbLA2y8MTIptTVN/vbAwQsdNSz3ONqBlfvHMm55ruUBTOWRCaO7HVmgjl3Tsq2PDs+bK5GW9QdweEU9tA5w==';

export const usePublicData = (page: number = 1, perPage: number = 1000) => {
  return useQuery({
    queryKey: ['publicData', page, perPage],
    queryFn: async (): Promise<PublicDataResponse> => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/15013094/v1/uddi:41944402-8249-4e45-9e9d-a52191710d06?page=${page}&perPage=${perPage}&serviceKey=${encodeURIComponent(API_KEY)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        return result;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1
  });
};
