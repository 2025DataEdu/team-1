
import { useMemo } from 'react';
import { useOpenData } from './useOpenData';

export const useOpenDataCategories = () => {
  const { data: openDataResult, isLoading, error } = useOpenData();

  const categoryStats = useMemo(() => {
    if (!openDataResult?.data) return [];

    console.log('전체 데이터 수:', openDataResult.data.length);
    
    // 분류체계별로 정확하게 그룹화
    const categoryGroups: Record<string, number> = {};
    
    openDataResult.data.forEach(item => {
      const category = item.분류체계;
      if (category) {
        categoryGroups[category] = (categoryGroups[category] || 0) + 1;
      }
    });

    console.log('분류체계별 상세 그룹화:', categoryGroups);

    // 각 분류체계의 실제 데이터 확인
    Object.keys(categoryGroups).forEach(category => {
      const categoryData = openDataResult.data.filter(item => item.분류체계 === category);
      console.log(`${category}: 계산된 수 = ${categoryGroups[category]}, 실제 필터된 수 = ${categoryData.length}`);
    });

    // 배열로 변환하고 정렬
    const categories = Object.entries(categoryGroups)
      .map(([name, count]) => ({
        name,
        count,
        value: count
      }))
      .sort((a, b) => b.count - a.count);

    console.log('최종 분류체계별 통계:', categories);

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
