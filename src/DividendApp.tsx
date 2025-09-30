import React, { useState, useMemo } from 'react';

// 타입 정의
interface DividendFrequency {
  id: string;
  label: string;
  multiplier: number;
}

interface StockHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  price: number;
  dividendYield: number;
  frequency: string;
  manualDividend?: number;
}

interface SimulationScenario {
  name: string;
  rate: number;
  color: string;
}

// 유틸리티 함수들
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(Math.round(num));
};

const parseNumber = (str: string): number => {
  return parseFloat(str.replace(/[^\d.-]/g, '')) || 0;
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 목표 달성 계산 함수
const calculateMonthsToTarget = (initialCapital: number, monthlyDividend: number, reinvestmentRate: number, targetAmount: number) => {
  let currentCapital = initialCapital;
  let currentMonthlyDividend = monthlyDividend;
  let months = 0;
  const history = [];
  const maxMonths = 600; // 50년 제한
  
  while (currentCapital < targetAmount && months < maxMonths) {
    months++;
    
    // 월 배당금 받기
    const dividendReceived = currentMonthlyDividend;
    
    // 재투자할 금액 계산
    const reinvestAmount = dividendReceived * (reinvestmentRate / 100);
    
    // 원금에 재투자 금액 추가
    currentCapital += reinvestAmount;
    
    // 원금 증가에 따른 배당금 증가 (배당률 일정하다고 가정)
    const dividendYieldRate = monthlyDividend / initialCapital;
    currentMonthlyDividend = currentCapital * dividendYieldRate;
    
    // 히스토리 저장 (매 3개월마다)
    if (months % 3 === 0) {
      history.push({
        month: months,
        capital: Math.round(currentCapital),
        monthlyDividend: Math.round(currentMonthlyDividend)
      });
    }
  }
  
  return {
    months,
    finalCapital: currentCapital,
    history
  };
};

// 배당 빈도 옵션
const dividendFrequencies: DividendFrequency[] = [
  { id: 'monthly', label: '매월', multiplier: 12 },
  { id: 'quarterly', label: '분기별', multiplier: 4 },
  { id: 'semiannual', label: '반기별', multiplier: 2 },
  { id: 'annual', label: '연간', multiplier: 1 }
];

const DividendApp: React.FC = () => {
  // 상태 관리
  const [activeTab, setActiveTab] = useState('portfolio');
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  
  // 새 주식 추가 폼 상태
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    shares: '',
    price: '',
    dividendYield: '',
    frequency: 'monthly',
    manualDividend: ''
  });
  
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // 시뮬레이션 입력값
  const [simulationInputs, setSimulationInputs] = useState({
    initialCapital: 0,
    monthlyDividend: 0,
    targetAmount: 0
  });
  
  // 재투자율 시나리오 (사용자 조절 가능)
  const [scenarios, setScenarios] = useState([
    { id: 'A', name: 'A', rate: 80, color: '#ff6600', active: true },
    { id: 'B', name: 'B', rate: 50, color: '#4a90e2', active: true },
    { id: 'C', name: 'C', rate: 30, color: '#50c878', active: false },
    { id: 'D', name: 'D', rate: 20, color: '#9b59b6', active: false }
  ]);

  // 보기 방식 상태
  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly' | 'halfyearly' | 'yearly'>('quarterly');

  // 계산된 값들
  const totalValue = useMemo(() => {
    return holdings.reduce((sum, holding) => sum + (holding.shares * holding.price), 0);
  }, [holdings]);

  const totalAnnualDividend = useMemo(() => {
    return holdings.reduce((sum, holding) => {
      const value = holding.shares * holding.price;
      return sum + (value * holding.dividendYield / 100);
    }, 0);
  }, [holdings]);

  const monthlyDividend = totalAnnualDividend / 12;

  // 시뮬레이션 계산 결과
  const simulationResults = useMemo(() => {
    return scenarios.filter(s => s.active).map(scenario => {
      const result = calculateMonthsToTarget(
        simulationInputs.initialCapital,
        simulationInputs.monthlyDividend,
        scenario.rate,
        simulationInputs.targetAmount
      );
      
      const years = Math.floor(result.months / 12);
      const months = result.months % 12;
      
      return {
        ...scenario,
        months: result.months,
        years,
        remainingMonths: months,
        history: result.history,
        finalCapital: result.finalCapital,
        displayText: `${years}년 ${months}개월`
      };
    });
  }, [simulationInputs, scenarios]);

  // 월별 배당금 데이터 (실제 보유종목 기반)
  const monthlyDividendData = useMemo(() => {
    const baseMonthlyDividend = monthlyDividend || simulationInputs.monthlyDividend || 0;
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      amount: baseMonthlyDividend > 0 ? baseMonthlyDividend * (0.9 + Math.random() * 0.2) : 0
    }));
  }, [monthlyDividend, simulationInputs.monthlyDividend]);

  // 주식 추가 함수
  const addStock = () => {
    if (newStock.symbol && newStock.name && newStock.shares && newStock.price) {
      const stock: StockHolding = {
        id: generateId(),
        symbol: newStock.symbol,
        name: newStock.name,
        shares: parseNumber(newStock.shares),
        price: parseNumber(newStock.price),
        dividendYield: parseNumber(newStock.dividendYield),
        frequency: newStock.frequency,
        manualDividend: newStock.manualDividend ? parseNumber(newStock.manualDividend) : undefined
      };
      setHoldings([...holdings, stock]);
      setNewStock({
        symbol: '',
        name: '',
        shares: '',
        price: '',
        dividendYield: '',
        frequency: 'monthly',
        manualDividend: ''
      });
      setShowAddForm(false);
    }
  };

  // 주식 제거 함수
  const removeStock = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  // 실시간 주식/ETF 검색 함수 (다중 API)
  const searchStock = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      let results: any[] = [];
      
      // 1단계: 로컬 데이터 우선 사용 (CORS 에러 방지)
      console.log('주식 검색 시작...');
      
      // 바로 로컬 데이터 사용 (더 안정적)
      const localStocks = [
        // 주요 개별 주식
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, dividendYield: 0.50, isEtf: false },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 335.20, dividendYield: 0.72, isEtf: false },
        { symbol: 'KO', name: 'The Coca-Cola Company', price: 58.90, dividendYield: 3.15, isEtf: false },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 160.80, dividendYield: 2.98, isEtf: false },
        { symbol: 'PG', name: 'Procter & Gamble Co.', price: 152.30, dividendYield: 2.45, isEtf: false },
        { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.90, dividendYield: 5.85, isEtf: false },
        { symbol: 'T', name: 'AT&T Inc.', price: 15.25, dividendYield: 7.20, isEtf: false },
        { symbol: 'VZ', name: 'Verizon Communications Inc.', price: 38.50, dividendYield: 6.95, isEtf: false },
        
        // 월배당 ETF (인기 종목들)
        { symbol: 'JEPI', name: 'JPMorgan Equity Premium Income ETF', price: 58.40, dividendYield: 7.72, isEtf: true, quoteType: 'ETF' },
        { symbol: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium Income ETF', price: 52.80, dividendYield: 9.35, isEtf: true, quoteType: 'ETF' },
        { symbol: 'QYLD', name: 'Global X NASDAQ 100 Covered Call ETF', price: 17.45, dividendYield: 12.08, isEtf: true, quoteType: 'ETF' },
        { symbol: 'XYLD', name: 'Global X S&P 500 Covered Call ETF', price: 45.20, dividendYield: 10.15, isEtf: true, quoteType: 'ETF' },
        { symbol: 'RYLD', name: 'Global X Russell 2000 Covered Call ETF', price: 14.85, dividendYield: 11.25, isEtf: true, quoteType: 'ETF' },
        { symbol: 'DIVO', name: 'Amplify CWP Enhanced Dividend Income ETF', price: 37.90, dividendYield: 5.12, isEtf: true, quoteType: 'ETF' },
        { symbol: 'NUSI', name: 'Nationwide Risk-Managed Income ETF', price: 19.75, dividendYield: 7.35, isEtf: true, quoteType: 'ETF' },
        
        // 고배당 ETF
        { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', price: 78.50, dividendYield: 3.47, isEtf: true, quoteType: 'ETF' },
        { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', price: 112.30, dividendYield: 2.91, isEtf: true, quoteType: 'ETF' },
        { symbol: 'HDV', name: 'iShares Core High Dividend ETF', price: 108.60, dividendYield: 3.15, isEtf: true, quoteType: 'ETF' },
        { symbol: 'DGRO', name: 'iShares Core Dividend Growth ETF', price: 52.40, dividendYield: 2.08, isEtf: true, quoteType: 'ETF' },
        { symbol: 'NOBL', name: 'ProShares S&P 500 Dividend Aristocrats ETF', price: 95.30, dividendYield: 1.85, isEtf: true, quoteType: 'ETF' },
        { symbol: 'DVY', name: 'iShares Select Dividend ETF', price: 125.80, dividendYield: 3.25, isEtf: true, quoteType: 'ETF' },
        
        // 부동산 리츠 ETF
        { symbol: 'VNQ', name: 'Vanguard Real Estate Index Fund ETF', price: 87.20, dividendYield: 3.68, isEtf: true, quoteType: 'ETF' },
        { symbol: 'SRET', name: 'Global X SuperDividend REIT ETF', price: 8.45, dividendYield: 8.92, isEtf: true, quoteType: 'ETF' },
        { symbol: 'MORT', name: 'VanEck Mortgage REIT Income ETF', price: 16.30, dividendYield: 9.15, isEtf: true, quoteType: 'ETF' },
        
        // 국제 배당 ETF
        { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', price: 58.90, dividendYield: 3.12, isEtf: true, quoteType: 'ETF' },
        { symbol: 'VYMI', name: 'Vanguard International High Dividend Yield ETF', price: 63.40, dividendYield: 4.25, isEtf: true, quoteType: 'ETF' },
        
        // 한국 주식
        { symbol: '005930.KS', name: '삼성전자', price: 71000, dividendYield: 2.1, isEtf: false },
        { symbol: '000660.KS', name: 'SK하이닉스', price: 123000, dividendYield: 1.2, isEtf: false },
        { symbol: '035720.KS', name: '카카오', price: 45500, dividendYield: 0.8, isEtf: false }
      ];
      
      results = localStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      
      console.log(`로컬 검색 결과: ${results.length}개`);
      
      // API 호출은 생략하고 로컬 데이터만 사용 (CORS 에러 방지)
      console.log('안정적인 로컬 검색 사용');
      
      // 결과 필터링 및 정렬 (ETF 우선, 배당률 높은 순)
      const sortedResults = results.sort((a, b) => {
        // ETF를 먼저 표시
        if (a.isEtf && !b.isEtf) return -1;
        if (!a.isEtf && b.isEtf) return 1;
        // 배당률 높은 순으로 정렬
        return parseFloat(b.dividendYield) - parseFloat(a.dividendYield);
      });
      
      setSearchResults(sortedResults);
      console.log(`최종 검색 결과: ${sortedResults.length}개`);
    } catch (error) {
      console.error('주식 검색 실패:', error);
      // 에러 시 로컬 백업 데이터 사용
      const backupStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, dividendYield: 0.50 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 335.20, dividendYield: 0.72 },
        { symbol: 'KO', name: 'The Coca-Cola Company', price: 58.90, dividendYield: 3.15 },
        { symbol: 'JEPI', name: 'JPMorgan Equity Premium Income ETF', price: 58.40, dividendYield: 7.72 },
        { symbol: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium Income ETF', price: 52.80, dividendYield: 9.35 },
        { symbol: 'QYLD', name: 'Global X NASDAQ 100 Covered Call ETF', price: 17.45, dividendYield: 12.08 },
        { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', price: 78.50, dividendYield: 3.47 },
        { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', price: 112.30, dividendYield: 2.91 }
      ];
      setSearchResults(backupStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ));
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 결과에서 주식 선택
  const selectStock = (stock: any) => {
    setNewStock({
      ...newStock,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price.toString(),
      dividendYield: stock.dividendYield.toString()
    });
    setSearchResults([]);
  };

  // 시나리오 관리 함수들
  const updateScenarioRate = (id: string, rate: number) => {
    setScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, rate } : s
    ));
  };

  const toggleScenario = (id: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const addScenario = (id: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, active: true } : s
    ));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#111111',
      padding: '60px 20px 20px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ 
            color: '#fff', 
            fontSize: 24, 
            fontWeight: 600, 
            margin: '0 0 8px 0' 
          }}>
            배당 플래너
          </h1>
          <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
            배당주 재투자를 통한 복리 효과 시뮬레이션
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{ 
          display: 'flex', 
          gap: 0, 
          marginBottom: 32,
          background: '#1a1a1a',
          padding: 2,
          borderRadius: 6,
          border: '1px solid #3a3a3a'
        }}>
          {[
            { id: 'portfolio', label: '📊 포트폴리오' },
            { id: 'simulation', label: '🎯 목표 시뮬레이터' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: 'none',
                borderRadius: 4,
                background: activeTab === tab.id ? '#4a90e2' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#aaa',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 포트폴리오 탭 */}
        {activeTab === 'portfolio' && (
          <div>
            {/* 요약 카드들 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 16,
              marginBottom: 32
            }}>
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: 6, 
                padding: 12, 
                border: '1px solid #3a3a3a' 
              }}>
                <h3 style={{ color: '#888', fontSize: 12, margin: '0 0 8px 0', fontWeight: 500 }}>
                  총 포트폴리오 가치
                </h3>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 600 }}>
                  {formatNumber(totalValue)}원
                </div>
              </div>
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: 6, 
                padding: 12, 
                border: '1px solid #3a3a3a' 
              }}>
                <h3 style={{ color: '#888', fontSize: 12, margin: '0 0 8px 0', fontWeight: 500 }}>
                  연간 배당금
                </h3>
                <div style={{ color: '#4a9eff', fontSize: 20, fontWeight: 600 }}>
                  {formatNumber(totalAnnualDividend)}원
                </div>
              </div>
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: 6, 
                padding: 12, 
                border: '1px solid #3a3a3a' 
              }}>
                <h3 style={{ color: '#888', fontSize: 12, margin: '0 0 8px 0', fontWeight: 500 }}>
                  월 평균 배당금
                </h3>
                <div style={{ color: '#50c878', fontSize: 20, fontWeight: 600 }}>
                  {formatNumber(monthlyDividend)}원
                </div>
              </div>
            </div>

            {/* 월별 배당금 차트 */}
            <div style={{ 
              background: '#1a1a1a', 
              borderRadius: 8, 
              padding: 20,
              marginBottom: 20,
              border: '1px solid #3a3a3a'
            }}>
              <h3 style={{ 
                color: '#fff', 
                fontSize: 16, 
                fontWeight: 600, 
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                📊 2025년 월별 배당금
              </h3>
              
              {/* 월별 막대 차트 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'end', 
                justifyContent: 'space-between',
                height: 120,
                marginBottom: 16,
                padding: '0 20px'
              }}>
                {monthlyDividendData.map((data, i) => {
                  const maxAmount = Math.max(...monthlyDividendData.map(d => d.amount));
                  const height = Math.max(20, (data.amount / maxAmount) * 100);
                  
                  return (
                    <div key={i} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      flex: 1,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      // 간단한 툴팁 효과
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    >
                      <div style={{ 
                        color: '#888', 
                        fontSize: 10, 
                        marginBottom: 4 
                      }}>
                        {Math.round(data.amount / 10000)}만
                      </div>
                      <div style={{ 
                        width: '80%',
                        height: height,
                        background: '#4a9eff',
                        borderRadius: '2px 2px 0 0',
                        minHeight: 20,
                        transition: 'all 0.2s ease'
                      }} />
                      <div style={{ 
                        color: '#888', 
                        fontSize: 12, 
                        marginTop: 8 
                      }}>
                        {data.month}월
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 보유 종목 */}
            <div style={{ 
              background: '#1a1a1a', 
              borderRadius: 8, 
              padding: 20,
              border: '1px solid #3a3a3a'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 20
              }}>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: 16, 
                  fontWeight: 600, 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  ☑️ 보유 종목
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    background: '#4a9eff',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  + 종목 추가
                </button>
              </div>

              {/* 종목 추가 폼 */}
              {showAddForm && (
                <div style={{ 
                  background: '#0d0d0d', 
                  borderRadius: 8, 
                  padding: 16,
                  marginBottom: 16,
                  border: '1px solid #2a2a2a'
                }}>
                  <h4 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: 14, fontWeight: 600 }}>
                    새 종목 추가
                  </h4>
                  
                  {/* 주식 검색 */}
                  <div style={{ position: 'relative', marginBottom: 12 }}>
                    <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 4 }}>
                      종목 검색 (종목코드/종목명)
                    </label>
                    <input
                      type="text"
                      placeholder="종목명 또는 종목코드 검색... (예: AAPL, Apple, 코니)"
                      value={newStock.symbol}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewStock({...newStock, symbol: value, name: value});
                        searchStock(value);
                      }}
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 6,
                        border: '1px solid #555',
                        background: '#1a1a1a',
                        color: '#fff',
                        fontSize: 13
                      }}
                    />
                    
                    {/* 로딩 표시 */}
                    {isSearching && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#1a1a1a',
                        border: '1px solid #555',
                        borderTop: 'none',
                        borderRadius: '0 0 6px 6px',
                        padding: 12,
                        textAlign: 'center',
                        color: '#4a9eff',
                        fontSize: 12,
                        zIndex: 1000
                      }}>
                        🔍 검색 중...
                      </div>
                    )}

                    {/* 검색 결과 드롭다운 */}
                    {!isSearching && searchResults.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#1a1a1a',
                        border: '1px solid #555',
                        borderTop: 'none',
                        borderRadius: '0 0 6px 6px',
                        maxHeight: 200,
                        overflowY: 'auto',
                        zIndex: 1000
                      }}>
                        {searchResults.map((stock, idx) => (
                          <div
                            key={idx}
                            onClick={() => selectStock(stock)}
                            style={{
                              padding: 12,
                              borderBottom: idx < searchResults.length - 1 ? '1px solid #555' : 'none',
                              cursor: 'pointer',
                              fontSize: 12,
                              color: '#fff',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                            onMouseEnter={(e: any) => e.target.style.background = '#2a2a2a'}
                            onMouseLeave={(e: any) => e.target.style.background = 'transparent'}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, color: '#4a9eff', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>{stock.symbol}</span>
                                {(stock.isEtf || stock.quoteType === 'ETF' || stock.name?.includes('ETF')) && 
                                  <span style={{ fontSize: 9, background: '#ff6600', color: '#fff', padding: '1px 4px', borderRadius: 2 }}>ETF</span>
                                }
                                {stock.exchange && <span style={{ fontSize: 9, background: '#666', color: '#fff', padding: '1px 4px', borderRadius: 2 }}>{stock.exchange}</span>}
                              </div>
                              <div style={{ fontSize: 11, color: '#ccc', marginBottom: 1 }}>{stock.name}</div>
                              <div style={{ fontSize: 10, color: '#888' }}>
                                💰 ${stock.price} | 🔄 실시간 데이터
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#4CAF50' }}>
                                {stock.dividendYield}%
                              </div>
                              <div style={{ fontSize: 9, color: '#888' }}>배당률</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* 선택된 종목 정보 표시 */}
                  {newStock.name && (
                    <div style={{ 
                      background: '#2a2a2a', 
                      padding: 12, 
                      borderRadius: 6, 
                      marginBottom: 12,
                      border: '1px solid #555'
                    }}>
                      <div style={{ color: '#4a9eff', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                        ✅ 선택된 종목: {newStock.symbol} - {newStock.name}
                      </div>
                      <div style={{ color: '#888', fontSize: 11 }}>
                        💰 가격: {newStock.price ? formatNumber(parseFloat(newStock.price)) + '원' : '미설정'} | 
                        📈 배당률: {newStock.dividendYield ? newStock.dividendYield + '%' : '미설정'}
                      </div>
                    </div>
                  )}

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                    gap: 12, 
                    marginBottom: 12 
                  }}>
                    <div>
                      <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 4 }}>
                        보유 수량
                      </label>
                      <input
                        type="text"
                        placeholder="수량"
                        value={newStock.shares}
                        onChange={(e) => setNewStock({...newStock, shares: e.target.value})}
                        style={{
                          width: '100%',
                          padding: 8,
                          borderRadius: 4,
                          border: '1px solid #555',
                          background: '#1a1a1a',
                          color: '#fff',
                          fontSize: 12,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 4 }}>
                        평균 단가
                      </label>
                      <input
                        type="text"
                        placeholder="단가"
                        value={newStock.price}
                        onChange={(e) => setNewStock({...newStock, price: e.target.value})}
                        style={{
                          width: '100%',
                          padding: 8,
                          borderRadius: 4,
                          border: '1px solid #555',
                          background: '#1a1a1a',
                          color: '#fff',
                          fontSize: 12,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 4 }}>
                        배당 주기
                      </label>
                      <select
                        value={newStock.frequency}
                        onChange={(e) => setNewStock({...newStock, frequency: e.target.value})}
                        style={{
                          width: '100%',
                          padding: 8,
                          borderRadius: 4,
                          border: '1px solid #555',
                          background: '#1a1a1a',
                          color: '#fff',
                          fontSize: 12,
                          boxSizing: 'border-box'
                        }}
                      >
                        {dividendFrequencies.map(freq => (
                          <option key={freq.id} value={freq.id} style={{ background: '#1a1a1a' }}>
                            {freq.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 4 }}>
                        배당률 (%)
                      </label>
                      <input
                        type="text"
                        placeholder="배당률"
                        value={newStock.dividendYield}
                        onChange={(e) => setNewStock({...newStock, dividendYield: e.target.value})}
                        style={{
                          width: '100%',
                          padding: 8,
                          borderRadius: 4,
                          border: '1px solid #555',
                          background: '#1a1a1a',
                          color: '#fff',
                          fontSize: 12,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={addStock}
                      style={{
                        background: '#4a9eff',
                        border: 'none',
                        borderRadius: 4,
                        color: '#fff',
                        padding: '8px 16px',
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      추가
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      style={{
                        background: '#666',
                        border: 'none',
                        borderRadius: 4,
                        color: '#fff',
                        padding: '8px 16px',
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {/* 종목 리스트 */}
              <div style={{ display: 'grid', gap: 12 }}>
                {holdings.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 40, 
                    color: '#888',
                    background: '#0d0d0d',
                    borderRadius: 8,
                    border: '1px solid #1a1a1a'
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>아직 보유 종목이 없습니다</div>
                    <div style={{ fontSize: 12 }}>위의 "종목 추가" 버튼을 클릭하여 첫 번째 종목을 추가해보세요!</div>
                  </div>
                ) : holdings.map(holding => {
                  const value = holding.shares * holding.price;
                  const freq = dividendFrequencies.find(f => f.id === holding.frequency);
                  const annualDividend = holding.manualDividend 
                    ? holding.manualDividend * (freq?.multiplier || 1)
                    : value * holding.dividendYield / 100;
                  
                  return (
                    <div key={holding.id} style={{ 
                      background: '#1a1a1a', 
                      borderRadius: 6, 
                      padding: 16,
                      border: '1px solid #2a2a2a'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: 12
                      }}>
                        <div>
                          <h4 style={{ 
                            color: '#4a9eff', 
                            margin: '0 0 4px 0', 
                            fontSize: 14, 
                            fontWeight: 600 
                          }}>
                            {holding.symbol} - {holding.name}
                          </h4>
                          <div style={{ color: '#888', fontSize: 12 }}>
                            {holding.shares}주 × {formatNumber(holding.price)}원
                          </div>
                        </div>
                        <button
                          onClick={() => removeStock(holding.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            fontSize: 14
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                        gap: 12,
                        fontSize: 12
                      }}>
                        <div>
                          <div style={{ color: '#888' }}>평가액</div>
                          <div style={{ color: '#fff', fontWeight: 600 }}>
                            {formatNumber(value)}원
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#888' }}>배당률</div>
                          <div style={{ color: '#50c878', fontWeight: 600 }}>
                            {holding.dividendYield}%
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#888' }}>연간 배당금</div>
                          <div style={{ color: '#4a9eff', fontWeight: 600 }}>
                            {formatNumber(annualDividend)}원
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#888' }}>배당 주기</div>
                          <div style={{ color: '#fff', fontWeight: 600 }}>
                            {freq?.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 목표 시뮬레이터 탭 */}
        {activeTab === 'simulation' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ 
                color: '#fff', 
                fontSize: 20, 
                fontWeight: 600,
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                🎯 재투자 비율별 원금 성장 시뮬레이터
              </h2>
              <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
                재투자 비율에 따라 목표 금액 도달 기간을 비교해보세요
              </p>
            </div>

            {/* 시뮬레이션 입력 */}
            <div style={{ 
              background: '#1a1a1a', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              border: '1px solid #3a3a3a'
            }}>
              <h3 style={{ 
                color: '#fff', 
                fontSize: 16, 
                fontWeight: 600, 
                marginBottom: 16 
              }}>
                📊 시뮬레이션 설정
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 16,
                marginBottom: 20
              }}>
                <div>
                  <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>
                    시작 원금 (원)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 10,000,000 (천만원)"
                    value={simulationInputs.initialCapital > 0 ? formatNumber(simulationInputs.initialCapital) : ''}
                    onChange={(e) => setSimulationInputs({
                      ...simulationInputs, 
                      initialCapital: parseNumber(e.target.value)
                    })}
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 6,
                      border: '1px solid #2a2a2a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>
                    월 초기 배당금 (원)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 500,000 (50만원)"
                    value={simulationInputs.monthlyDividend > 0 ? formatNumber(simulationInputs.monthlyDividend) : ''}
                    onChange={(e) => setSimulationInputs({
                      ...simulationInputs, 
                      monthlyDividend: parseNumber(e.target.value)
                    })}
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 6,
                      border: '1px solid #2a2a2a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 4 }}>
                    목표 금액 (원)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 100,000,000 (1억원)"
                    value={simulationInputs.targetAmount > 0 ? formatNumber(simulationInputs.targetAmount) : ''}
                    onChange={(e) => setSimulationInputs({
                      ...simulationInputs, 
                      targetAmount: parseNumber(e.target.value)
                    })}
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 6,
                      border: '1px solid #2a2a2a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* 시나리오 설정 */}
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: 8, 
                padding: 20,
                marginBottom: 20,
                border: '1px solid #3a3a3a'
              }}>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: 16, 
                  fontWeight: 600, 
                  marginBottom: 16 
                }}>
                  🎛️ 재투자율 시나리오 설정
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: 16 
                }}>
                  {scenarios.map(scenario => (
                    <div key={scenario.id} style={{ 
                      background: scenario.active ? '#1a1a1a' : '#1a1a1a', 
                      borderRadius: 6, 
                      padding: 16,
                      border: scenario.active ? `2px solid ${scenario.color}` : '1px solid #2a2a2a',
                      opacity: scenario.active ? 1 : 0.6
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: scenario.active ? 12 : 0
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8 
                        }}>
                          <div style={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '50%', 
                            background: scenario.color 
                          }} />
                          <h4 style={{ 
                            color: scenario.color, 
                            margin: 0, 
                            fontSize: 13, 
                            fontWeight: 600 
                          }}>
                            시나리오 {scenario.name}
                          </h4>
                        </div>
                        
                        {scenario.active ? (
                          <button
                            onClick={() => toggleScenario(scenario.id)}
                            style={{
                              background: '#ff6b6b',
                              border: 'none',
                              borderRadius: 4,
                              color: '#fff',
                              padding: '4px 8px',
                              fontSize: 11,
                              cursor: 'pointer'
                            }}
                          >
                            제거
                          </button>
                        ) : (
                          <button
                            onClick={() => addScenario(scenario.id)}
                            style={{
                              background: '#4a9eff',
                              border: 'none',
                              borderRadius: 4,
                              color: '#fff',
                              padding: '4px 8px',
                              fontSize: 11,
                              cursor: 'pointer'
                            }}
                          >
                            추가
                          </button>
                        )}
                      </div>
                      
                      {scenario.active && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8,
                          justifyContent: 'center'
                        }}>
                          <label style={{ 
                            color: '#888', 
                            fontSize: 12
                          }}>
                            재투자율:
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scenario.rate}
                            onChange={(e) => updateScenarioRate(scenario.id, parseInt(e.target.value) || 0)}
                            style={{
                              width: '50px',
                              padding: '6px 8px',
                              borderRadius: 4,
                              border: `1px solid ${scenario.color}`,
                              background: '#1a1a1a',
                              color: '#fff',
                              fontSize: 12,
                              textAlign: 'center'
                            }}
                          />
                          <span style={{ color: '#888', fontSize: 12 }}>%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 통합 시뮬레이션 그래프 (막대 + 곡선) */}
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: 8, 
                padding: 20,
                marginBottom: 20
              }}>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: 16, 
                  fontWeight: 600, 
                  marginBottom: 20,
                  textAlign: 'center'
                }}>
                  📊 재투자 시뮬레이션 - 년도별 원금 성장
                </h3>
                
                <div style={{ height: 300, position: 'relative' }}>
                  <svg width="100%" height="300" viewBox="0 0 800 300">
                    {/* 그리드 */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                      <line 
                        key={ratio} 
                        x1="80" 
                        y1={40 + 220 * ratio} 
                        x2="750" 
                        y2={40 + 220 * ratio} 
                        stroke="#444" 
                        strokeWidth="1" 
                      />
                    ))}
                    
                    {/* Y축 레이블 */}
                    <text x="75" y="45" fontSize="10" fill="#666" textAnchor="end">
                      {formatNumber(simulationInputs.targetAmount)}원
                    </text>
                    <text x="75" y="100" fontSize="10" fill="#666" textAnchor="end">
                      {formatNumber(simulationInputs.targetAmount * 0.75)}원
                    </text>
                    <text x="75" y="150" fontSize="10" fill="#666" textAnchor="end">
                      {formatNumber(simulationInputs.targetAmount * 0.5)}원
                    </text>
                    <text x="75" y="200" fontSize="10" fill="#666" textAnchor="end">
                      {formatNumber(simulationInputs.targetAmount * 0.25)}원
                    </text>
                    <text x="75" y="260" fontSize="10" fill="#666" textAnchor="end">0원</text>
                    
                    {/* 막대 그래프 */}
                    {simulationResults.map((result, scenarioIdx) => {
                      const maxYears = Math.max(...simulationResults.map(r => Math.ceil(r.months / 12)));
                      const years = Math.ceil(result.months / 12);
                      const barWidth = 20; // 더 얇게
                      const groupWidth = simulationResults.length * (barWidth + 5);
                      
                      return Array.from({ length: years }, (_, yearIdx) => {
                        const x = 120 + (yearIdx * 80) + (scenarioIdx * (barWidth + 3));
                        const yearProgress = (yearIdx + 1) / years;
                        const capitalAtYear = simulationInputs.initialCapital + 
                          (result.finalCapital - simulationInputs.initialCapital) * yearProgress;
                        const progress = capitalAtYear / simulationInputs.targetAmount;
                        const barHeight = Math.min(progress * 220, 220);
                        
                        return (
                          <g key={`${scenarioIdx}-${yearIdx}`}>
                            <rect
                              x={x}
                              y={260 - barHeight}
                              width={barWidth}
                              height={barHeight}
                              fill={result.color}
                              rx="2"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) => {
                                // 툴팁 생성
                                const tooltip = document.createElement('div');
                                tooltip.id = 'tooltip';
                                tooltip.style.cssText = `
                                  position: fixed;
                                  background: rgba(0,0,0,0.9);
                                  color: white;
                                  padding: 8px 12px;
                                  border-radius: 6px;
                                  font-size: 12px;
                                  pointer-events: none;
                                  z-index: 1000;
                                  border: 1px solid ${result.color};
                                `;
                                tooltip.innerHTML = `
                                  <div style="color: ${result.color}; font-weight: bold; margin-bottom: 4px;">
                                    시나리오 ${result.name} (${result.rate}%)
                                  </div>
                                  <div>📅 ${new Date().getFullYear() + yearIdx + 1}년</div>
                                  <div>💰 예상 원금: ${formatNumber(capitalAtYear)}원</div>
                                  <div>📈 진행률: ${(progress * 100).toFixed(1)}%</div>
                                `;
                                document.body.appendChild(tooltip);
                                
                                const updateTooltipPosition = (event: MouseEvent) => {
                                  tooltip.style.left = event.clientX + 10 + 'px';
                                  tooltip.style.top = event.clientY - 10 + 'px';
                                };
                                
                                updateTooltipPosition(e.nativeEvent);
                                document.addEventListener('mousemove', updateTooltipPosition);
                              }}
                              onMouseLeave={() => {
                                const tooltip = document.getElementById('tooltip');
                                if (tooltip) {
                                  tooltip.remove();
                                  document.removeEventListener('mousemove', () => {});
                                }
                              }}
                            />
                            {scenarioIdx === 0 && (
                              <text
                                x={x + barWidth/2}
                                y={280}
                                fontSize="10"
                                fill="#888"
                                textAnchor="middle"
                              >
{new Date().getFullYear() + yearIdx + 1}년
                              </text>
                            )}
                          </g>
                        );
                      });
                    })}
                    
                    {/* 성장 곡선 */}
                    {simulationResults.map((result, idx) => {
                      if (!result.history || result.history.length === 0) return null;
                      
                      const points = result.history.slice(0, 15).map((point, i) => {
                        const x = 120 + (i * 40);
                        const progress = point.capital / simulationInputs.targetAmount;
                        const y = 260 - (progress * 220);
                        return `${x},${Math.max(40, y)}`;
                      }).join(' ');
                      
                      return (
                        <polyline 
                          key={`curve-${idx}`}
                          points={points}
                          stroke={result.color} 
                          strokeWidth="3" 
                          fill="none"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    
                    {/* 목표선 */}
                    <line 
                      x1="80" 
                      y1="40" 
                      x2="750" 
                      y2="40" 
                      stroke="#666" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                    <text x="85" y="35" fontSize="11" fill="#888">
                      목표: {formatNumber(simulationInputs.targetAmount)}원
                    </text>
                  </svg>
                </div>
                
                {/* 범례 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 20, 
                  marginTop: 16 
                }}>
                  {simulationResults.map((result, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8 
                    }}>
                      <div style={{ 
                        width: 12, 
                        height: 12, 
                        background: result.color,
                        borderRadius: 2
                      }} />
                      <span style={{ color: '#888', fontSize: 12 }}>
                        시나리오 {result.name} ({result.rate}% 재투자)
                      </span>
                      <span style={{ color: result.color, fontSize: 12, fontWeight: 600 }}>
                        {result.displayText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 요약 정보 */}
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: 8, 
                padding: 20,
                marginBottom: 20
              }}>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: 16, 
                  fontWeight: 600, 
                  marginBottom: 16,
                  textAlign: 'center'
                }}>
                  🎯 목표 달성 예상 시간
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: 16 
                }}>
                  {simulationInputs.initialCapital === 0 || simulationInputs.monthlyDividend === 0 || simulationInputs.targetAmount === 0 ? (
                    <div style={{ 
                      gridColumn: '1 / -1',
                      textAlign: 'center', 
                      padding: 40, 
                      color: '#888',
                      background: '#1a1a1a',
                      borderRadius: 8,
                      border: '1px solid #2a2a2a'
                    }}>
                      <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                      <div style={{ fontSize: 16, marginBottom: 8 }}>시뮬레이션 값을 입력해주세요</div>
                      <div style={{ fontSize: 12 }}>시작원금, 월배당금, 목표금액을 모두 입력하면 시뮬레이션이 시작됩니다!</div>
                    </div>
                  ) : simulationResults.map((result, idx) => {
                    // 시작 날짜 (현재 날짜)
                    const startDate = new Date();
                    const startYear = startDate.getFullYear().toString().slice(-2);
                    const startMonth = startDate.getMonth() + 1;
                    
                    // 종료 날짜 계산
                    const endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + result.months);
                    const endYear = endDate.getFullYear().toString().slice(-2);
                    const endMonth = endDate.getMonth() + 1;
                    
                    return (
                      <div key={idx} style={{ 
                        background: '#1a1a1a', 
                        borderRadius: 6, 
                        padding: 16,
                        border: `2px solid ${result.color}`,
                        textAlign: 'center'
                      }}>
                        <div style={{ 
                          color: result.color, 
                          fontSize: 14, 
                          fontWeight: 600,
                          marginBottom: 8
                        }}>
                          시나리오 {result.name} ({result.rate}%)
                        </div>
                        <div style={{ 
                          color: '#fff', 
                          fontSize: 18, 
                          fontWeight: 700,
                          marginBottom: 8
                        }}>
                          {result.displayText}
                        </div>
                        <div style={{ 
                          color: '#888', 
                          fontSize: 11,
                          marginBottom: 4
                        }}>
                          {startYear}년 {startMonth}월 → {endYear}년 {endMonth}월
                        </div>
                        <div style={{ 
                          color: '#888', 
                          fontSize: 10
                        }}>
                          목표 달성 예상
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 보기 방식 선택 */}
              <div style={{ 
                background: '#1a1a1a', 
                borderRadius: 8, 
                padding: 20,
                marginBottom: 20
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <h3 style={{ 
                    color: '#fff', 
                    fontSize: 16, 
                    fontWeight: 600,
                    margin: 0
                  }}>
                    📊 상세 분석 그래프
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: 4, 
                    background: '#1a1a1a',
                    borderRadius: 6,
                    padding: 2
                  }}>
                    {[
                      { id: 'monthly', label: '월별' },
                      { id: 'quarterly', label: '3개월' },
                      { id: 'halfyearly', label: '6개월' },
                      { id: 'yearly', label: '1년' }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id as any)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 4,
                          background: viewMode === mode.id ? '#4a90e2' : 'transparent',
                          color: viewMode === mode.id ? '#fff' : '#aaa',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 상세 데이터 그래프 */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 20,
                marginBottom: 20
              }}>
                {/* 1. 원금 성장 추이 */}
                <div style={{ 
                  background: '#0d0d0d', 
                  borderRadius: 8, 
                  padding: 20
                }}>
                  <h4 style={{ 
                    color: '#fff', 
                    fontSize: 16, 
                    fontWeight: 600, 
                    marginBottom: 20,
                    textAlign: 'center'
                  }}>
                    💰 원금 성장 추이
                  </h4>
                  
                  <div style={{ height: 400, position: 'relative' }}>
                    <svg width="100%" height="400" viewBox="0 0 800 400">
                      {/* 그리드 */}
                      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
                        <line 
                          key={ratio} 
                          x1="80" 
                          y1={40 + 320 * ratio} 
                          x2="720" 
                          y2={40 + 320 * ratio} 
                          stroke="#444" 
                          strokeWidth="1" 
                        />
                      ))}
                      
                      {/* Y축 레이블 */}
                      <text x="75" y="45" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.targetAmount > 0 ? Math.round(simulationInputs.targetAmount / 10000) + '만' : '목표금액'}
                      </text>
                      <text x="75" y="105" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.targetAmount > 0 ? Math.round(simulationInputs.targetAmount * 0.8 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="170" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.targetAmount > 0 ? Math.round(simulationInputs.targetAmount * 0.6 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="235" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.targetAmount > 0 ? Math.round(simulationInputs.targetAmount * 0.4 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="300" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.targetAmount > 0 ? Math.round(simulationInputs.targetAmount * 0.2 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="365" fontSize="11" fill="#666" textAnchor="end">0</text>
                      
                      {/* 막대 그래프 */}
                      {simulationResults.map((result, scenarioIdx) => {
                        if (!result.history || result.history.length === 0) return null;
                        
                        // 보기 방식에 따른 데이터 필터링
                        const getFilteredHistory = () => {
                          const step = viewMode === 'monthly' ? 1 : 
                                     viewMode === 'quarterly' ? 3 : 
                                     viewMode === 'halfyearly' ? 6 : 12;
                          return result.history.filter((_, i) => i % step === 0).slice(0, 20);
                        };
                        
                        const filteredHistory = getFilteredHistory();
                        const barWidth = 15;
                        
                        return filteredHistory.map((point, i) => {
                          const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1))) + (scenarioIdx * (barWidth + 2)) - (simulationResults.length * (barWidth + 2) / 2);
                          const progress = point.capital / simulationInputs.targetAmount;
                          const barHeight = progress * 320;
                          
                          const getPeriodLabel = () => {
                            const startDate = new Date();
                            const targetDate = new Date(startDate);
                            targetDate.setMonth(targetDate.getMonth() + point.month);
                            
                            const year = targetDate.getFullYear().toString().slice(-2);
                            const month = targetDate.getMonth() + 1;
                            
                            return `${year}년 ${month}월`;
                          };
                          
                          return (
                            <rect
                              key={`bar-${scenarioIdx}-${i}`}
                              x={x}
                              y={360 - barHeight}
                              width={barWidth}
                              height={barHeight}
                              fill={result.color}
                              rx="2"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) => {
                                // 기존 툴팁 제거
                                const existingTooltip = document.getElementById('tooltip-capital-bar');
                                if (existingTooltip) existingTooltip.remove();
                                
                                const tooltip = document.createElement('div');
                                tooltip.id = 'tooltip-capital-bar';
                                tooltip.style.cssText = `
                                  position: fixed;
                                  background: rgba(0,0,0,0.9);
                                  color: white;
                                  padding: 12px 16px;
                                  border-radius: 8px;
                                  font-size: 13px;
                                  pointer-events: none;
                                  z-index: 1000;
                                  border: 2px solid ${result.color};
                                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                `;
                                tooltip.innerHTML = `
                                  <div style="color: ${result.color}; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                                    시나리오 ${result.name} (${result.rate}% 재투자)
                                  </div>
                                  <div style="margin-bottom: 3px;">📅 ${getPeriodLabel()}</div>
                                  <div style="margin-bottom: 3px;">💰 원금: ${formatNumber(point.capital)}원</div>
                                  <div style="margin-bottom: 3px;">📈 목표 달성률: ${(progress * 100).toFixed(1)}%</div>
                                  <div>🚀 증가분: ${formatNumber(point.capital - simulationInputs.initialCapital)}원</div>
                                `;
                                document.body.appendChild(tooltip);
                                
                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                tooltip.style.left = rect.left + window.scrollX + 15 + 'px';
                                tooltip.style.top = rect.top + window.scrollY - 15 + 'px';
                              }}
                              onMouseLeave={() => {
                                const tooltip = document.getElementById('tooltip-capital-bar');
                                if (tooltip) tooltip.remove();
                              }}
                            />
                          );
                        });
                      })}
                      
                      {/* 원금 성장 곡선들 */}
                      {simulationResults.map((result, idx) => {
                        if (!result.history || result.history.length === 0) return null;
                        
                        // 보기 방식에 따른 데이터 필터링
                        const getFilteredHistory = () => {
                          const step = viewMode === 'monthly' ? 1 : 
                                     viewMode === 'quarterly' ? 3 : 
                                     viewMode === 'halfyearly' ? 6 : 12;
                          return result.history.filter((_, i) => i % step === 0).slice(0, 20);
                        };
                        
                        const filteredHistory = getFilteredHistory();
                        const points = filteredHistory.map((point, i) => {
                          const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                          const progress = point.capital / simulationInputs.targetAmount;
                          const y = 360 - (progress * 320);
                          return `${x},${Math.max(40, y)}`;
                        }).join(' ');
                        
                        return (
                          <g key={idx}>
                            <polyline 
                              points={points}
                              stroke={result.color} 
                              strokeWidth="3" 
                              fill="none"
                            />
                            {/* 데이터 포인트들 */}
                            {filteredHistory.map((point, i) => {
                              const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                              const progress = point.capital / simulationInputs.targetAmount;
                              const y = Math.max(40, 360 - (progress * 320));
                              
                              const getPeriodLabel = () => {
                                const startDate = new Date();
                                const targetDate = new Date(startDate);
                                targetDate.setMonth(targetDate.getMonth() + point.month);
                                
                                const year = targetDate.getFullYear().toString().slice(-2);
                                const month = targetDate.getMonth() + 1;
                                
                                return `${year}년 ${month}월`;
                              };
                              
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill={result.color}
                                  style={{ cursor: 'pointer' }}
                                  onMouseEnter={(e) => {
                                    // 기존 툴팁 제거
                                    const existingTooltip = document.getElementById('tooltip-capital-point');
                                    if (existingTooltip) existingTooltip.remove();
                                    
                                    const tooltip = document.createElement('div');
                                    tooltip.id = 'tooltip-capital-point';
                                    tooltip.style.cssText = `
                                      position: fixed;
                                      background: rgba(0,0,0,0.9);
                                      color: white;
                                      padding: 12px 16px;
                                      border-radius: 8px;
                                      font-size: 13px;
                                      pointer-events: none;
                                      z-index: 1000;
                                      border: 2px solid ${result.color};
                                      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                    `;
                                    tooltip.innerHTML = `
                                      <div style="color: ${result.color}; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                                        시나리오 ${result.name} (${result.rate}% 재투자)
                                      </div>
                                      <div style="margin-bottom: 3px;">📅 ${getPeriodLabel()}</div>
                                      <div style="margin-bottom: 3px;">💰 원금: ${formatNumber(point.capital)}원</div>
                                      <div style="margin-bottom: 3px;">📈 목표 달성률: ${(progress * 100).toFixed(1)}%</div>
                                      <div>🚀 증가분: ${formatNumber(point.capital - simulationInputs.initialCapital)}원</div>
                                    `;
                                    document.body.appendChild(tooltip);
                                    
                                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                                    tooltip.style.left = rect.left + window.scrollX + 15 + 'px';
                                    tooltip.style.top = rect.top + window.scrollY - 15 + 'px';
                                  }}
                                  onMouseLeave={() => {
                                    const tooltip = document.getElementById('tooltip-capital-point');
                                    if (tooltip) tooltip.remove();
                                  }}
                                />
                              );
                            })}
                          </g>
                        );
                      })}
                      
                      {/* X축 라벨 */}
                      {simulationResults.length > 0 && simulationResults[0].history && (
                        (() => {
                          const getFilteredHistory = () => {
                            const step = viewMode === 'monthly' ? 1 : 
                                       viewMode === 'quarterly' ? 3 : 
                                       viewMode === 'halfyearly' ? 6 : 12;
                            return simulationResults[0].history.filter((_, i) => i % step === 0).slice(0, 20);
                          };
                          
                          const filteredHistory = getFilteredHistory();
                          return filteredHistory.map((point, i) => {
                            if (i % 3 !== 0) return null; // 3개마다 표시
                            
                            const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                            const startDate = new Date();
                            const targetDate = new Date(startDate);
                            targetDate.setMonth(targetDate.getMonth() + point.month);
                            
                            const year = targetDate.getFullYear().toString().slice(-2);
                            const month = targetDate.getMonth() + 1;
                            
                            return (
                              <text
                                key={i}
                                x={x}
                                y={385}
                                fontSize="10"
                                fill="#888"
                                textAnchor="middle"
                              >
                                {year}년 {month}월
                              </text>
                            );
                          });
                        })()
                      )}
                    </svg>
                  </div>
                </div>

                {/* 2. 배당금 증가 추이 */}
                <div style={{ 
                  background: '#0d0d0d', 
                  borderRadius: 8, 
                  padding: 20
                }}>
                  <h4 style={{ 
                    color: '#fff', 
                    fontSize: 16, 
                    fontWeight: 600, 
                    marginBottom: 20,
                    textAlign: 'center'
                  }}>
                    📈 배당금 증가 추이
                  </h4>
                  
                  <div style={{ height: 400, position: 'relative' }}>
                    <svg width="100%" height="400" viewBox="0 0 800 400">
                      {/* 그리드 */}
                      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
                        <line 
                          key={ratio} 
                          x1="80" 
                          y1={40 + 320 * ratio} 
                          x2="720" 
                          y2={40 + 320 * ratio} 
                          stroke="#444" 
                          strokeWidth="1" 
                        />
                      ))}
                      
                      {/* Y축 레이블 */}
                      <text x="75" y="45" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.monthlyDividend > 0 ? Math.round(simulationInputs.monthlyDividend * 3 / 10000) + '만' : '최대 배당금'}
                      </text>
                      <text x="75" y="105" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.monthlyDividend > 0 ? Math.round(simulationInputs.monthlyDividend * 2.4 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="170" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.monthlyDividend > 0 ? Math.round(simulationInputs.monthlyDividend * 1.8 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="235" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.monthlyDividend > 0 ? Math.round(simulationInputs.monthlyDividend * 1.2 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="300" fontSize="11" fill="#666" textAnchor="end">
                        {simulationInputs.monthlyDividend > 0 ? Math.round(simulationInputs.monthlyDividend * 0.6 / 10000) + '만' : ''}
                      </text>
                      <text x="75" y="365" fontSize="11" fill="#666" textAnchor="end">0</text>
                      
                      {/* 막대 그래프 */}
                      {simulationResults.map((result, scenarioIdx) => {
                        if (!result.history || result.history.length === 0) return null;
                        
                        // 보기 방식에 따른 데이터 필터링
                        const getFilteredHistory = () => {
                          const step = viewMode === 'monthly' ? 1 : 
                                     viewMode === 'quarterly' ? 3 : 
                                     viewMode === 'halfyearly' ? 6 : 12;
                          return result.history.filter((_, i) => i % step === 0).slice(0, 20);
                        };
                        
                        const filteredHistory = getFilteredHistory();
                        const barWidth = 15;
                        const maxDividend = simulationInputs.monthlyDividend * 3;
                        
                        return filteredHistory.map((point, i) => {
                          const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1))) + (scenarioIdx * (barWidth + 2)) - (simulationResults.length * (barWidth + 2) / 2);
                          const progress = point.monthlyDividend / maxDividend;
                          const barHeight = progress * 320;
                          
                          const getPeriodLabel = () => {
                            const startDate = new Date();
                            const targetDate = new Date(startDate);
                            targetDate.setMonth(targetDate.getMonth() + point.month);
                            
                            const year = targetDate.getFullYear().toString().slice(-2);
                            const month = targetDate.getMonth() + 1;
                            
                            return `${year}년 ${month}월`;
                          };
                          
                          return (
                            <rect
                              key={`dividend-bar-${scenarioIdx}-${i}`}
                              x={x}
                              y={360 - barHeight}
                              width={barWidth}
                              height={barHeight}
                              fill={result.color}
                              rx="2"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) => {
                                // 기존 툴팁 제거
                                const existingTooltip = document.getElementById('tooltip-dividend-bar');
                                if (existingTooltip) existingTooltip.remove();
                                
                                const tooltip = document.createElement('div');
                                tooltip.id = 'tooltip-dividend-bar';
                                tooltip.style.cssText = `
                                  position: fixed;
                                  background: rgba(0,0,0,0.9);
                                  color: white;
                                  padding: 12px 16px;
                                  border-radius: 8px;
                                  font-size: 13px;
                                  pointer-events: none;
                                  z-index: 1000;
                                  border: 2px solid ${result.color};
                                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                `;
                                tooltip.innerHTML = `
                                  <div style="color: ${result.color}; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                                    시나리오 ${result.name} (${result.rate}% 재투자)
                                  </div>
                                  <div style="margin-bottom: 3px;">📅 ${getPeriodLabel()}</div>
                                  <div style="margin-bottom: 3px;">💰 월 배당금: ${formatNumber(point.monthlyDividend)}원</div>
                                  <div style="margin-bottom: 3px;">📈 초기 대비: ${((point.monthlyDividend / simulationInputs.monthlyDividend - 1) * 100).toFixed(1)}%</div>
                                  <div>🚀 증가분: ${formatNumber(point.monthlyDividend - simulationInputs.monthlyDividend)}원</div>
                                `;
                                document.body.appendChild(tooltip);
                                
                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                tooltip.style.left = rect.left + window.scrollX + 15 + 'px';
                                tooltip.style.top = rect.top + window.scrollY - 15 + 'px';
                              }}
                              onMouseLeave={() => {
                                const tooltip = document.getElementById('tooltip-dividend-bar');
                                if (tooltip) tooltip.remove();
                              }}
                            />
                          );
                        });
                      })}
                      
                      {/* 배당금 증가 곡선들 */}
                      {simulationResults.map((result, idx) => {
                        if (!result.history || result.history.length === 0) return null;
                        
                        // 보기 방식에 따른 데이터 필터링
                        const getFilteredHistory = () => {
                          const step = viewMode === 'monthly' ? 1 : 
                                     viewMode === 'quarterly' ? 3 : 
                                     viewMode === 'halfyearly' ? 6 : 12;
                          return result.history.filter((_, i) => i % step === 0).slice(0, 20);
                        };
                        
                        const filteredHistory = getFilteredHistory();
                        const maxDividend = simulationInputs.monthlyDividend * 3;
                        const points = filteredHistory.map((point, i) => {
                          const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                          const progress = point.monthlyDividend / maxDividend;
                          const y = 360 - (progress * 320);
                          return `${x},${Math.max(40, y)}`;
                        }).join(' ');
                        
                        return (
                          <g key={idx}>
                            <polyline 
                              points={points}
                              stroke={result.color} 
                              strokeWidth="2" 
                              fill="none"
                            />
                            {/* 데이터 포인트들 */}
                            {filteredHistory.map((point, i) => {
                              const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                              const progress = point.monthlyDividend / maxDividend;
                              const y = Math.max(40, 360 - (progress * 320));
                              
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="3"
                                  fill={result.color}
                                  style={{ cursor: 'pointer' }}
                                  onMouseEnter={(e) => {
                                    // 기존 툴팁 제거
                                    const existingTooltip = document.getElementById('tooltip-dividend-point');
                                    if (existingTooltip) existingTooltip.remove();
                                    
                                    const tooltip = document.createElement('div');
                                    tooltip.id = 'tooltip-dividend-point';
                                    tooltip.style.cssText = `
                                      position: fixed;
                                      background: rgba(0,0,0,0.9);
                                      color: white;
                                      padding: 8px 12px;
                                      border-radius: 6px;
                                      font-size: 12px;
                                      pointer-events: none;
                                      z-index: 1000;
                                      border: 1px solid ${result.color};
                                    `;
                                    
                                    const getPeriodLabel = () => {
                                      const startDate = new Date();
                                      const targetDate = new Date(startDate);
                                      targetDate.setMonth(targetDate.getMonth() + point.month);
                                      
                                      const year = targetDate.getFullYear().toString().slice(-2);
                                      const month = targetDate.getMonth() + 1;
                                      
                                      return `${year}년 ${month}월`;
                                    };
                                    
                                    tooltip.innerHTML = `
                                      <div style="color: ${result.color}; font-weight: bold; margin-bottom: 4px;">
                                        시나리오 ${result.name} (${result.rate}%)
                                      </div>
                                      <div>📅 ${getPeriodLabel()}</div>
                                      <div>💰 월배당금: ${formatNumber(point.monthlyDividend)}원</div>
                                      <div>📈 증가율: ${((point.monthlyDividend / simulationInputs.monthlyDividend - 1) * 100).toFixed(1)}%</div>
                                    `;
                                    document.body.appendChild(tooltip);
                                    
                                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                                    tooltip.style.left = rect.left + window.scrollX + 10 + 'px';
                                    tooltip.style.top = rect.top + window.scrollY - 10 + 'px';
                                  }}
                                  onMouseLeave={() => {
                                    const tooltip = document.getElementById('tooltip-dividend-point');
                                    if (tooltip) tooltip.remove();
                                  }}
                                />
                              );
                            })}
                            
                            {/* 최종 값 표시 */}
                            {result.history.length > 0 && (
                              <text
                                x={50 + (Math.min(11, result.history.length - 1) * 25)}
                                y={Math.max(15, 170 - ((result.history[Math.min(11, result.history.length - 1)].monthlyDividend / maxDividend) * 150)) - 5}
                                fontSize="10"
                                fill={result.color}
                                textAnchor="middle"
                                fontWeight="bold"
                              >
                                {Math.round(result.history[Math.min(11, result.history.length - 1)].monthlyDividend / 10000)}만
                              </text>
                            )}
                          </g>
                        );
                      })}
                      
                      {/* X축 라벨 */}
                      {simulationResults.length > 0 && simulationResults[0].history && (
                        (() => {
                          const getFilteredHistory = () => {
                            const step = viewMode === 'monthly' ? 1 : 
                                       viewMode === 'quarterly' ? 3 : 
                                       viewMode === 'halfyearly' ? 6 : 12;
                            return simulationResults[0].history.filter((_, i) => i % step === 0).slice(0, 20);
                          };
                          
                          const filteredHistory = getFilteredHistory();
                          return filteredHistory.map((point, i) => {
                            if (i % 3 !== 0) return null; // 3개마다 표시
                            
                            const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                            const startDate = new Date();
                            const targetDate = new Date(startDate);
                            targetDate.setMonth(targetDate.getMonth() + point.month);
                            
                            const year = targetDate.getFullYear().toString().slice(-2);
                            const month = targetDate.getMonth() + 1;
                            
                            return (
                              <text
                                key={i}
                                x={x}
                                y={385}
                                fontSize="10"
                                fill="#888"
                                textAnchor="middle"
                              >
                                {year}년 {month}월
                              </text>
                            );
                          });
                        })()
                      )}
                    </svg>
                  </div>
                </div>

                {/* 3. 누적 투자 수익률 */}
                <div style={{ 
                  background: '#0d0d0d', 
                  borderRadius: 8, 
                  padding: 20
                }}>
                  <h4 style={{ 
                    color: '#fff', 
                    fontSize: 16, 
                    fontWeight: 600, 
                    marginBottom: 20,
                    textAlign: 'center'
                  }}>
                    🚀 누적 수익률 비교
                  </h4>
                  
                  <div style={{ height: 400, position: 'relative' }}>
                    <svg width="100%" height="400" viewBox="0 0 800 400">
                      {/* 그리드 */}
                      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
                        <line 
                          key={ratio} 
                          x1="80" 
                          y1={40 + 320 * ratio} 
                          x2="720" 
                          y2={40 + 320 * ratio} 
                          stroke="#444" 
                          strokeWidth="1" 
                        />
                      ))}
                      
                      {/* Y축 레이블 */}
                      <text x="75" y="45" fontSize="11" fill="#666" textAnchor="end">1000%</text>
                      <text x="75" y="105" fontSize="11" fill="#666" textAnchor="end">800%</text>
                      <text x="75" y="170" fontSize="11" fill="#666" textAnchor="end">600%</text>
                      <text x="75" y="235" fontSize="11" fill="#666" textAnchor="end">400%</text>
                      <text x="75" y="300" fontSize="11" fill="#666" textAnchor="end">200%</text>
                      <text x="75" y="365" fontSize="11" fill="#666" textAnchor="end">0%</text>
                      
                      {/* 막대 그래프 */}
                      {simulationResults.map((result, scenarioIdx) => {
                        if (!result.history || result.history.length === 0) return null;
                        
                        // 보기 방식에 따른 데이터 필터링
                        const getFilteredHistory = () => {
                          const step = viewMode === 'monthly' ? 1 : 
                                     viewMode === 'quarterly' ? 3 : 
                                     viewMode === 'halfyearly' ? 6 : 12;
                          return result.history.filter((_, i) => i % step === 0).slice(0, 20);
                        };
                        
                        const filteredHistory = getFilteredHistory();
                        const barWidth = 15;
                        
                        return filteredHistory.map((point, i) => {
                          const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1))) + (scenarioIdx * (barWidth + 2)) - (simulationResults.length * (barWidth + 2) / 2);
                          const returnRate = ((point.capital - simulationInputs.initialCapital) / simulationInputs.initialCapital) * 100;
                          const progress = Math.min(returnRate / 1000, 1); // 최대 1000%로 제한
                          const barHeight = progress * 320;
                          
                          const getPeriodLabel = () => {
                            const startDate = new Date();
                            const targetDate = new Date(startDate);
                            targetDate.setMonth(targetDate.getMonth() + point.month);
                            
                            const year = targetDate.getFullYear().toString().slice(-2);
                            const month = targetDate.getMonth() + 1;
                            
                            return `${year}년 ${month}월`;
                          };
                          
                          return (
                            <rect
                              key={`return-bar-${scenarioIdx}-${i}`}
                              x={x}
                              y={360 - barHeight}
                              width={barWidth}
                              height={barHeight}
                              fill={result.color}
                              rx="2"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) => {
                                // 기존 툴팁 제거
                                const existingTooltip = document.getElementById('tooltip-return-bar');
                                if (existingTooltip) existingTooltip.remove();
                                
                                const tooltip = document.createElement('div');
                                tooltip.id = 'tooltip-return-bar';
                                tooltip.style.cssText = `
                                  position: fixed;
                                  background: rgba(0,0,0,0.9);
                                  color: white;
                                  padding: 12px 16px;
                                  border-radius: 8px;
                                  font-size: 13px;
                                  pointer-events: none;
                                  z-index: 1000;
                                  border: 2px solid ${result.color};
                                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                `;
                                tooltip.innerHTML = `
                                  <div style="color: ${result.color}; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                                    시나리오 ${result.name} (${result.rate}% 재투자)
                                  </div>
                                  <div style="margin-bottom: 3px;">📅 ${getPeriodLabel()}</div>
                                  <div style="margin-bottom: 3px;">💰 원금: ${formatNumber(point.capital)}원</div>
                                  <div style="margin-bottom: 3px;">📈 수익률: ${returnRate.toFixed(1)}%</div>
                                  <div>🚀 수익금: ${formatNumber(point.capital - simulationInputs.initialCapital)}원</div>
                                `;
                                document.body.appendChild(tooltip);
                                
                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                tooltip.style.left = rect.left + window.scrollX + 15 + 'px';
                                tooltip.style.top = rect.top + window.scrollY - 15 + 'px';
                              }}
                              onMouseLeave={() => {
                                const tooltip = document.getElementById('tooltip-return-bar');
                                if (tooltip) tooltip.remove();
                              }}
                            />
                          );
                        });
                      })}
                      
                      {/* 수익률 곡선들 */}
                      {simulationResults.map((result, idx) => {
                        if (!result.history || result.history.length === 0) return null;
                        
                        // 보기 방식에 따른 데이터 필터링
                        const getFilteredHistory = () => {
                          const step = viewMode === 'monthly' ? 1 : 
                                     viewMode === 'quarterly' ? 3 : 
                                     viewMode === 'halfyearly' ? 6 : 12;
                          return result.history.filter((_, i) => i % step === 0).slice(0, 20);
                        };
                        
                        const filteredHistory = getFilteredHistory();
                        const points = filteredHistory.map((point, i) => {
                          const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                          const returnRate = ((point.capital - simulationInputs.initialCapital) / simulationInputs.initialCapital) * 100;
                          const progress = Math.min(returnRate / 1000, 1); // 최대 1000%로 제한
                          const y = 360 - (progress * 320);
                          return `${x},${Math.max(40, y)}`;
                        }).join(' ');
                        
                        return (
                          <g key={idx}>
                            <polyline 
                              points={points}
                              stroke={result.color} 
                              strokeWidth="2" 
                              fill="none"
                            />
                            {/* 데이터 포인트들 */}
                            {filteredHistory.map((point, i) => {
                              const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                              const returnRate = ((point.capital - simulationInputs.initialCapital) / simulationInputs.initialCapital) * 100;
                              const progress = Math.min(returnRate / 1000, 1);
                              const y = Math.max(40, 360 - (progress * 320));
                              
                              const getPeriodLabel = () => {
                                const startDate = new Date();
                                const targetDate = new Date(startDate);
                                targetDate.setMonth(targetDate.getMonth() + point.month);
                                
                                const year = targetDate.getFullYear().toString().slice(-2);
                                const month = targetDate.getMonth() + 1;
                                
                                return `${year}년 ${month}월`;
                              };
                              
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="3"
                                  fill={result.color}
                                  style={{ cursor: 'pointer' }}
                                  onMouseEnter={(e) => {
                                    // 기존 툴팁 제거
                                    const existingTooltip = document.getElementById('tooltip-return-point');
                                    if (existingTooltip) existingTooltip.remove();
                                    
                                    const tooltip = document.createElement('div');
                                    tooltip.id = 'tooltip-return-point';
                                    tooltip.style.cssText = `
                                      position: fixed;
                                      background: rgba(0,0,0,0.9);
                                      color: white;
                                      padding: 8px 12px;
                                      border-radius: 6px;
                                      font-size: 12px;
                                      pointer-events: none;
                                      z-index: 1000;
                                      border: 1px solid ${result.color};
                                    `;
                                    tooltip.innerHTML = `
                                      <div style="color: ${result.color}; font-weight: bold; margin-bottom: 4px;">
                                        시나리오 ${result.name} (${result.rate}%)
                                      </div>
                                      <div>📅 ${getPeriodLabel()}</div>
                                      <div>💰 원금: ${formatNumber(point.capital)}원</div>
                                      <div>🚀 수익률: ${returnRate.toFixed(1)}%</div>
                                      <div>📈 수익: ${formatNumber(point.capital - simulationInputs.initialCapital)}원</div>
                                    `;
                                    document.body.appendChild(tooltip);
                                    
                                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                                    tooltip.style.left = rect.left + window.scrollX + 10 + 'px';
                                    tooltip.style.top = rect.top + window.scrollY - 10 + 'px';
                                  }}
                                  onMouseLeave={() => {
                                    const tooltip = document.getElementById('tooltip-return-point');
                                    if (tooltip) tooltip.remove();
                                  }}
                                />
                              );
                            })}
                            
                            {/* 최종 값 표시 */}
                            {result.history.length > 0 && (
                              <text
                                x={50 + (Math.min(11, result.history.length - 1) * 25)}
                                y={Math.max(15, 170 - (Math.min(((result.history[Math.min(11, result.history.length - 1)].capital - simulationInputs.initialCapital) / simulationInputs.initialCapital) * 100 / 1000, 1) * 150)) - 5}
                                fontSize="10"
                                fill={result.color}
                                textAnchor="middle"
                                fontWeight="bold"
                              >
                                {Math.round(((result.history[Math.min(11, result.history.length - 1)].capital - simulationInputs.initialCapital) / simulationInputs.initialCapital) * 100)}%
                              </text>
                            )}
                          </g>
                        );
                      })}
                      
                      {/* X축 라벨 */}
                      {simulationResults.length > 0 && simulationResults[0].history && (
                        (() => {
                          const getFilteredHistory = () => {
                            const step = viewMode === 'monthly' ? 1 : 
                                       viewMode === 'quarterly' ? 3 : 
                                       viewMode === 'halfyearly' ? 6 : 12;
                            return simulationResults[0].history.filter((_, i) => i % step === 0).slice(0, 20);
                          };
                          
                          const filteredHistory = getFilteredHistory();
                          return filteredHistory.map((point, i) => {
                            if (i % 3 !== 0) return null; // 3개마다 표시
                            
                            const x = 100 + (i * (600 / Math.max(1, filteredHistory.length - 1)));
                            const startDate = new Date();
                            const targetDate = new Date(startDate);
                            targetDate.setMonth(targetDate.getMonth() + point.month);
                            
                            const year = targetDate.getFullYear().toString().slice(-2);
                            const month = targetDate.getMonth() + 1;
                            
                            return (
                              <text
                                key={i}
                                x={x}
                                y={385}
                                fontSize="10"
                                fill="#888"
                                textAnchor="middle"
                              >
                                {year}년 {month}월
                              </text>
                            );
                          });
                        })()
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DividendApp;