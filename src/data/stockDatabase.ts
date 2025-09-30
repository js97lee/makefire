// 확장된 주식 데이터베이스 (한국 + 미국 주요 종목)
export const expandedStockDatabase = [
  // 한국 주요 배당주
  { symbol: 'KT', name: 'KT', price: 32000, dividendYield: 4.2, isEtf: false, country: 'KR' },
  { symbol: '005930', name: '삼성전자', price: 71000, dividendYield: 2.1, isEtf: false, country: 'KR' },
  { symbol: '000660', name: 'SK하이닉스', price: 128000, dividendYield: 1.8, isEtf: false, country: 'KR' },
  { symbol: '035420', name: 'NAVER', price: 195000, dividendYield: 0.8, isEtf: false, country: 'KR' },
  { symbol: '207940', name: '삼성바이오로직스', price: 850000, dividendYield: 0.5, isEtf: false, country: 'KR' },
  
  // 미국 주요 배당주
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, dividendYield: 0.5, isEtf: false, country: 'US' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, dividendYield: 0.7, isEtf: false, country: 'US' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.45, dividendYield: 3.1, isEtf: false, country: 'US' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 155.20, dividendYield: 2.4, isEtf: false, country: 'US' },
  { symbol: 'KO', name: 'The Coca-Cola Company', price: 58.75, dividendYield: 3.2, isEtf: false, country: 'US' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', price: 171.30, dividendYield: 2.8, isEtf: false, country: 'US' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 165.40, dividendYield: 1.3, isEtf: false, country: 'US' },
  { symbol: 'HD', name: 'The Home Depot', price: 335.80, dividendYield: 2.5, isEtf: false, country: 'US' },
  { symbol: 'V', name: 'Visa Inc.', price: 245.60, dividendYield: 0.8, isEtf: false, country: 'US' },
  { symbol: 'MA', name: 'Mastercard Incorporated', price: 425.30, dividendYield: 0.5, isEtf: false, country: 'US' },
  
  // 미국 고배당 ETF
  { symbol: 'JEPI', name: 'JPMorgan Equity Premium Income ETF', price: 55.20, dividendYield: 7.8, isEtf: true, country: 'US' },
  { symbol: 'QYLD', name: 'Global X NASDAQ 100 Covered Call ETF', price: 17.85, dividendYield: 12.1, isEtf: true, country: 'US' },
  { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', price: 78.45, dividendYield: 3.5, isEtf: true, country: 'US' },
  { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', price: 112.30, dividendYield: 2.9, isEtf: true, country: 'US' },
  { symbol: 'SPHD', name: 'Invesco S&P 500 High Dividend Low Volatility ETF', price: 42.15, dividendYield: 4.2, isEtf: true, country: 'US' },
  { symbol: 'DVY', name: 'iShares Select Dividend ETF', price: 128.90, dividendYield: 3.8, isEtf: true, country: 'US' },
  { symbol: 'NOBL', name: 'ProShares S&P 500 Dividend Aristocrats ETF', price: 95.75, dividendYield: 1.8, isEtf: true, country: 'US' },
  { symbol: 'DGRO', name: 'iShares Core Dividend Growth ETF', price: 56.20, dividendYield: 2.1, isEtf: true, country: 'US' },
  { symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF', price: 172.40, dividendYield: 1.7, isEtf: true, country: 'US' },
  { symbol: 'HDV', name: 'iShares Core High Dividend ETF', price: 108.65, dividendYield: 3.4, isEtf: true, country: 'US' },
  
  // 한국 ETF
  { symbol: '069500', name: 'KODEX 200', price: 35500, dividendYield: 1.8, isEtf: true, country: 'KR' },
  { symbol: '114800', name: 'KODEX 인버스', price: 4850, dividendYield: 0, isEtf: true, country: 'KR' },
  { symbol: '251340', name: 'KODEX 코스닥150', price: 12800, dividendYield: 0.9, isEtf: true, country: 'KR' },
  
  // 리츠 (REITs)
  { symbol: 'O', name: 'Realty Income Corporation', price: 58.40, dividendYield: 5.8, isEtf: false, country: 'US' },
  { symbol: 'STAG', name: 'Stag Industrial Inc.', price: 38.25, dividendYield: 4.1, isEtf: false, country: 'US' },
  { symbol: 'WPC', name: 'W. P. Carey Inc.', price: 78.90, dividendYield: 5.9, isEtf: false, country: 'US' },
  
  // 유틸리티 (고배당)
  { symbol: 'NEE', name: 'NextEra Energy Inc.', price: 62.15, dividendYield: 3.2, isEtf: false, country: 'US' },
  { symbol: 'DUK', name: 'Duke Energy Corporation', price: 98.75, dividendYield: 4.1, isEtf: false, country: 'US' },
  { symbol: 'SO', name: 'The Southern Company', price: 72.30, dividendYield: 3.8, isEtf: false, country: 'US' },
  
  // 통신주 (고배당)
  { symbol: 'T', name: 'AT&T Inc.', price: 15.85, dividendYield: 7.2, isEtf: false, country: 'US' },
  { symbol: 'VZ', name: 'Verizon Communications Inc.', price: 38.40, dividendYield: 6.8, isEtf: false, country: 'US' },
  
  // 금융주
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 158.20, dividendYield: 2.4, isEtf: false, country: 'US' },
  { symbol: 'BAC', name: 'Bank of America Corporation', price: 32.85, dividendYield: 2.8, isEtf: false, country: 'US' },
  { symbol: 'WFC', name: 'Wells Fargo & Company', price: 45.60, dividendYield: 2.9, isEtf: false, country: 'US' },
];

// 종목 상세 정보 가져오기 (Alpha Vantage OVERVIEW)
export const getStockOverview = async (symbol: string) => {
  const API_KEY = 'KRWI0C5MTTXBLYIF';
  
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    return {
      dividendYield: data.DividendYield ? parseFloat(data.DividendYield) * 100 : null, // %로 변환
      price: data.BookValue ? parseFloat(data.BookValue) : null,
      marketCap: data.MarketCapitalization,
      peRatio: data.PERatio,
      sector: data.Sector
    };
  } catch (error) {
    console.error(`${symbol} 상세 정보 가져오기 실패:`, error);
    return null;
  }
};

// ETF 우선 검색을 위한 개선된 API 함수
export const searchStockAPI = async (query: string) => {
  const API_KEY = 'KRWI0C5MTTXBLYIF'; // Alpha Vantage API 키
  
  try {
    console.log(`🔍 API 검색 시작: "${query}"`);
    
    // 1단계: 종목 검색
    const searchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`;
    console.log('🌐 검색 URL:', searchUrl);
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    console.log('📊 API 응답:', data);
    
    // API 에러 체크
    if (data.Note) {
      console.error('⚠️ API 호출 제한:', data.Note);
      return [];
    }
    
    if (data['Error Message']) {
      console.error('❌ API 에러:', data['Error Message']);
      return [];
    }
    
    if (data.bestMatches && data.bestMatches.length > 0) {
      console.log(`✅ ${data.bestMatches.length}개 종목 발견`);
      
      // ETF를 우선적으로 정렬하고 상위 5개 선택 (ETF 중심)
      const sortedMatches = data.bestMatches.sort((a, b) => {
        const aIsETF = a['3. type'] === 'ETF';
        const bIsETF = b['3. type'] === 'ETF';
        
        // ETF를 먼저 표시
        if (aIsETF && !bIsETF) return -1;
        if (!aIsETF && bIsETF) return 1;
        
        // 같은 타입이면 매치 정확도로 정렬 (심볼이 정확히 일치하는 것 우선)
        const aExactMatch = a['1. symbol'].toLowerCase() === query.toLowerCase();
        const bExactMatch = b['1. symbol'].toLowerCase() === query.toLowerCase();
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        return 0;
      });
      
      const topMatches = sortedMatches.slice(0, 5); // ETF 우선이므로 5개로 증가
      const enrichedResults = [];
      
      for (const match of topMatches) {
        const symbol = match['1. symbol'];
        
        const isETF = match['3. type'] === 'ETF';
        const isUS = match['4. region'] === 'United States';
        
        // 기본 정보 설정 (API 전용, ETF 최적화)
        let stockInfo = {
          symbol: symbol,
          name: match['2. name'],
          price: 0,
          dividendYield: isETF ? (isUS ? 4.2 : 3.8) : (isUS ? 2.5 : 2.0), // ETF는 더 높은 기본 배당률
          isEtf: isETF,
          country: isUS ? 'US' : 'OTHER',
          isEstimated: true // 기본적으로 추정값
        };
        
        console.log(`📋 ${symbol} (${isETF ? 'ETF' : 'Stock'}): 기본 배당률 ${stockInfo.dividendYield}%`);
        
        // 무조건 API 호출로 실제 데이터 가져오기
        try {
          console.log(`${symbol} 상세 정보 API 호출 중...`);
          const overview = await getStockOverview(symbol);
          if (overview && overview.dividendYield) {
            stockInfo.dividendYield = overview.dividendYield;
            stockInfo.price = overview.price || 0;
            stockInfo.isEstimated = false;
            console.log(`${symbol}: 배당률 ${overview.dividendYield}% (API)`);
          } else {
            console.log(`${symbol}: API에서 배당률 정보 없음, 기본값 사용`);
          }
          
          // API 호출 간격 (Alpha Vantage 제한 고려)
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`${symbol} 상세 정보 가져오기 실패:`, error);
        }
        
        enrichedResults.push(stockInfo);
      }
      
      return enrichedResults;
    } else {
      console.log('❌ 검색 결과 없음');
      
      // ETF 관련 키워드인 경우 추가 검색 시도
      if (query.toLowerCase().includes('etf') || 
          query.toLowerCase().includes('dividend') || 
          query.toLowerCase().includes('reit') ||
          query.toLowerCase().includes('spy') ||
          query.toLowerCase().includes('qqq') ||
          query.toLowerCase().includes('vti') ||
          query.toLowerCase().includes('vym')) {
        
        console.log('🔄 ETF 관련 키워드 감지, 추가 검색 시도...');
        
        // 인기 ETF 목록으로 대체 검색
        const popularETFs = ['SPY', 'QQQ', 'VTI', 'VYM', 'SCHD', 'JEPI', 'JEPQ', 'DIVO'];
        const matchingETFs = popularETFs.filter(etf => 
          etf.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(etf.toLowerCase())
        );
        
        if (matchingETFs.length > 0) {
          console.log(`🎯 매칭된 인기 ETF: ${matchingETFs.join(', ')}`);
          // 첫 번째 매칭 ETF로 재검색 (무한 루프 방지)
          if (query !== matchingETFs[0]) {
            return await searchStockAPI(matchingETFs[0]);
          }
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('❌ API 검색 실패:', error);
    return [];
  }
};

// 하이브리드 검색 함수
export const hybridStockSearch = async (query: string) => {
  // 1. 로컬 데이터에서 먼저 검색
  const localResults = expandedStockDatabase.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
  
  // 2. 로컬 결과가 충분하면 반환
  if (localResults.length >= 5) {
    return localResults.slice(0, 10);
  }
  
  // 3. 부족하면 API에서 추가 검색
  try {
    const apiResults = await searchStockAPI(query);
    return [...localResults, ...apiResults].slice(0, 10);
  } catch (error) {
    console.error('하이브리드 검색 실패:', error);
    return localResults;
  }
};
