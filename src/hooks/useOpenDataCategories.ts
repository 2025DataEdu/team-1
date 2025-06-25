
import { useMemo } from 'react';
import { useOpenData } from './useOpenData';

export const useOpenDataCategories = () => {
  const { data: openDataResult, isLoading, error } = useOpenData();

  const categoryStats = useMemo(() => {
    if (!openDataResult?.data) return [];

    // 국토교통부 데이터만 필터링 (더 유연한 조건으로 수정)
    const moitData = openDataResult.data.filter(item => {
      const listName = item.목록명 || '';
      const department = item.담당부서 || '';
      const agency = item.기관명 || '';
      
      return listName.includes('국토교통부') || 
             department.includes('국토교통부') || 
             agency.includes('국토교통부') ||
             listName.startsWith('국토교통부_') || 
             listName.startsWith('국토교통부 ');
    });

    console.log('전체 데이터 수:', openDataResult.data.length);
    console.log('국토교통부 필터링된 데이터 수:', moitData.length);

    // 분류체계별로 그룹화
    const categoryGroups: Record<string, number> = {};
    
    moitData.forEach(item => {
      const category = item.분류체계 || '기타';
      categoryGroups[category] = (categoryGroups[category] || 0) + 1;
    });

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
    const totalCount = moitData.length;
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
