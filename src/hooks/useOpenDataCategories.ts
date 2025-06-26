
import { useMemo } from 'react';
import { useOpenData } from './useOpenData';

export const useOpenDataCategories = () => {
  const { data: openDataResult, isLoading, error } = useOpenData();

  const categoryStats = useMemo(() => {
    if (!openDataResult?.data) return [];

    // 모든 데이터에서 분류체계별로 그룹화
    const categoryGroups: Record<string, number> = {};
    
    openDataResult.data.forEach(item => {
      const category = item.분류체계 || '기타';
      categoryGroups[category] = (categoryGroups[category] || 0) + 1;
    });

    console.log('전체 데이터 수:', openDataResult.data.length);
    console.log('분류체계별 그룹화:', categoryGroups);

    // 배열로 변환하고 정렬
    const categories = Object.entries(categoryGroups)
      .map(([name, count]) => ({
        name,
        count,
        value: count // 차트용
      }))
      .sort((a, b) => b.count - a.count);

    console.log('분류체계별 통계:', categories);

    // 전체 카테고리를 맨 앞에 추가
    const totalCount = openDataResult.data.length;
    return [
      { name: '전체', count: totalCount, value: totalCount },
      ...categories
    ];
  }, [openDataResult?.data]);

  return {
    categories: categoryStats,
    isLoading,
    error,
    totalCount: openDataResult?.totalCount || 0
  };
};
