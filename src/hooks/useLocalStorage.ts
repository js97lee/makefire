import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 로컬스토리지에서 값을 가져오는 함수
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 값을 설정하는 함수
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수가 전달된 경우 현재 값으로 실행
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 상태 업데이트
      setStoredValue(valueToStore);
      
      // 로컬스토리지에 저장
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 컴포넌트 마운트 시 로컬스토리지에서 값 로드
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, []);

  return [storedValue, setValue] as const;
}

// 포트폴리오 데이터 자동 저장 훅
export function usePortfolioStorage() {
  const [savedHoldings, setSavedHoldings] = useLocalStorage('portfolio_holdings', []);
  const [savedInputs, setSavedInputs] = useLocalStorage('simulation_inputs', {
    initialCapital: 0,
    monthlyDividend: 0,
    targetAmount: 0
  });

  // 데이터 저장 함수
  const savePortfolioData = (holdings: any[], inputs: any) => {
    setSavedHoldings(holdings);
    setSavedInputs(inputs);
  };

  // 데이터 불러오기 함수
  const loadPortfolioData = () => {
    return {
      holdings: savedHoldings,
      inputs: savedInputs
    };
  };

  // 데이터 초기화 함수
  const clearPortfolioData = () => {
    setSavedHoldings([]);
    setSavedInputs({
      initialCapital: 0,
      monthlyDividend: 0,
      targetAmount: 0
    });
  };

  return {
    savePortfolioData,
    loadPortfolioData,
    clearPortfolioData,
    hasSavedData: savedHoldings.length > 0 || savedInputs.initialCapital > 0
  };
}
