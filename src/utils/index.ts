// 유틸리티 함수들
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(Math.round(num));
};

export const parseNumber = (str: string): number => {
  return parseFloat(str.replace(/[^\d.-]/g, '')) || 0;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 목표 달성 계산 함수 (개선된 버전)
export const calculateMonthsToTarget = (
  initialCapital: number, 
  monthlyDividend: number, 
  reinvestmentRate: number, 
  targetAmount: number
) => {
  let currentCapital = initialCapital;
  let currentMonthlyDividend = monthlyDividend;
  let months = 0;
  const history = [];
  const maxMonths = 600; // 50년 제한
  
  // 연 배당률 계산 (월 배당금 * 12 / 초기 자본)
  const annualDividendYield = (monthlyDividend * 12) / initialCapital;
  
  while (currentCapital < targetAmount && months < maxMonths) {
    months++;
    
    // 월 배당금 받기
    const dividendReceived = currentMonthlyDividend;
    
    // 재투자할 금액 계산
    const reinvestAmount = dividendReceived * (reinvestmentRate / 100);
    
    // 원금에 재투자 금액 추가
    currentCapital += reinvestAmount;
    
    // 배당금 증가 (더 현실적인 계산)
    // 분기별로만 배당금 재계산 (매월 계산하면 너무 급격함)
    if (months % 3 === 0) {
      currentMonthlyDividend = currentCapital * (annualDividendYield / 12);
    }
    
    // 히스토리 저장 (매월)
    history.push({
      month: months,
      capital: Math.round(currentCapital),
      monthlyDividend: Math.round(currentMonthlyDividend)
    });
  }
  
  return {
    months,
    finalCapital: currentCapital,
    history
  };
};

// 날짜 포맷팅 함수
export const formatPeriodLabel = (monthsFromNow: number): string => {
  const startDate = new Date();
  const targetDate = new Date(startDate);
  targetDate.setMonth(targetDate.getMonth() + monthsFromNow);
  
  const year = targetDate.getFullYear().toString().slice(-2);
  const month = targetDate.getMonth() + 1;
  
  return `${year}년 ${month}월`;
};

// 툴팁 생성 유틸리티
export const createTooltip = (id: string, content: string, color: string, rect: DOMRect) => {
  // 기존 툴팁 제거
  const existingTooltip = document.getElementById(id);
  if (existingTooltip) existingTooltip.remove();
  
  const tooltip = document.createElement('div');
  tooltip.id = id;
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    pointer-events: none;
    z-index: 1000;
    border: 2px solid ${color};
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  tooltip.innerHTML = content;
  document.body.appendChild(tooltip);
  
  tooltip.style.left = rect.left + window.scrollX + 15 + 'px';
  tooltip.style.top = rect.top + window.scrollY - 15 + 'px';
};

export const removeTooltip = (id: string) => {
  const tooltip = document.getElementById(id);
  if (tooltip) tooltip.remove();
};
