import { useState } from 'react';
import { localStockData } from '../data/constants';

export const useStockSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchStock = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      console.log('주식 검색 시작...');
      
      const results = localStockData.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      
      console.log(`로컬 검색 결과: ${results.length}개`);
      
      // 결과 필터링 및 정렬 (ETF 우선, 배당률 높은 순)
      const sortedResults = results.sort((a, b) => {
        // ETF를 먼저 표시
        if (a.isEtf && !b.isEtf) return -1;
        if (!a.isEtf && b.isEtf) return 1;
        // 배당률 높은 순으로 정렬
        return parseFloat(b.dividendYield.toString()) - parseFloat(a.dividendYield.toString());
      });
      
      setSearchResults(sortedResults);
      console.log(`최종 검색 결과: ${sortedResults.length}개`);
    } catch (error) {
      console.error('주식 검색 실패:', error);
      // 에러 시 로컬 백업 데이터 사용
      const backupStocks = localStockData.slice(0, 8);
      setSearchResults(backupStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ));
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchResults,
    isSearching,
    searchStock,
    clearResults: () => setSearchResults([])
  };
};
