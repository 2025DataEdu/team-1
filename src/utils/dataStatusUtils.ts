
export interface DataStatus {
  status: 'active' | 'upcoming' | 'overdue' | 'unknown';
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const getDataStatus = (createdAt: string, nextRegistrationDate: string): DataStatus => {
  const today = new Date();
  const created = new Date(createdAt);
  const nextDate = nextRegistrationDate && nextRegistrationDate !== '없음' ? new Date(nextRegistrationDate) : null;
  
  // 차기등록 예정일이 없는 경우
  if (!nextDate || nextRegistrationDate === '없음') {
    return {
      status: 'active',
      label: '서비스중',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    };
  }
  
  // 차기등록 예정일이 지난 경우 (연체)
  if (nextDate < today) {
    return {
      status: 'overdue',
      label: '갱신필요',
      color: 'text-red-800',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    };
  }
  
  // 차기등록 예정일이 30일 이내인 경우
  const daysUntilNext = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilNext <= 30) {
    return {
      status: 'upcoming',
      label: `${daysUntilNext}일 후 갱신`,
      color: 'text-orange-800',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200'
    };
  }
  
  // 정상 상태
  return {
    status: 'active',
    label: '서비스중',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  };
};

export const getStatusSummary = (data: any[]) => {
  const summary = {
    active: 0,
    upcoming: 0,
    overdue: 0,
    unknown: 0
  };
  
  data.forEach(item => {
    const status = getDataStatus(item.created_at || item.registDt, item.next_registration_date || '없음');
    summary[status.status]++;
  });
  
  return summary;
};
