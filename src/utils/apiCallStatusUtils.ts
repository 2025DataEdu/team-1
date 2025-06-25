
export interface ApiCallStatus {
  status: 'completed' | 'required' | 'unknown';
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const getApiCallStatus = (nextRegistrationDate: string): ApiCallStatus => {
  const today = new Date();
  
  // 차기등록 예정일이 없는 경우
  if (!nextRegistrationDate || nextRegistrationDate === '없음' || nextRegistrationDate === '') {
    return {
      status: 'unknown',
      label: '정보 없음',
      color: 'text-gray-800',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200'
    };
  }
  
  const nextDate = new Date(nextRegistrationDate);
  
  // 유효하지 않은 날짜인 경우
  if (isNaN(nextDate.getTime())) {
    return {
      status: 'unknown',
      label: '정보 없음',
      color: 'text-gray-800',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200'
    };
  }
  
  // 차기등록 예정일이 지난 경우 (갱신 필요)
  if (nextDate < today) {
    return {
      status: 'required',
      label: '갱신 필요',
      color: 'text-red-800',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    };
  }
  
  // 차기등록 예정일이 지나지 않은 경우 (갱신 완료)
  return {
    status: 'completed',
    label: '갱신 완료',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  };
};

export const getApiCallStatusSummary = (data: any[]) => {
  const summary = {
    completed: 0,
    required: 0,
    unknown: 0
  };
  
  data.forEach(item => {
    // api_call 테이블에는 '차기등록 예정일' 컬럼이 없을 수 있으므로
    // 적절한 컬럼명을 확인하고 사용해야 합니다
    const nextRegistrationDate = item['차기등록 예정일'] || item.next_registration_date || '';
    const status = getApiCallStatus(nextRegistrationDate);
    summary[status.status]++;
  });
  
  return summary;
};
