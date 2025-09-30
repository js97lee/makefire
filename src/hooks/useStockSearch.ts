import { useState } from 'react';
import { localStockData } from '../data/constants';
import { expandedStockDatabase, hybridStockSearch } from '../data/stockDatabase';

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
      console.log('API 우선 주식 검색 시작...');
      
      // 1. API 검색을 먼저 시도
      try {
        const apiResults = await hybridStockSearch(query);
        if (apiResults && apiResults.length > 0) {
          console.log(`API 검색 결과: ${apiResults.length}개`);
          setSearchResults(apiResults);
          return;
        }
      } catch (apiError) {
        console.error('API 검색 실패:', apiError);
      }
      
      // 2. API 실패 시에만 로컬 DB 사용
      console.log('API 실패, 로컬 DB 검색...');
      const results = expandedStockDatabase.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      
      // 결과 필터링 및 정렬 (ETF 우선, 배당률 높은 순)
      const sortedResults = results.sort((a, b) => {
        // ETF를 먼저 표시
        if (a.isEtf && !b.isEtf) return -1;
        if (!a.isEtf && b.isEtf) return 1;
        // 배당률 높은 순으로 정렬
        return parseFloat(b.dividendYield.toString()) - parseFloat(a.dividendYield.toString());
      });
      
      setSearchResults(sortedResults);
      console.log(`로컬 DB 백업 결과: ${sortedResults.length}개`);
      
    } catch (error) {
      console.error('전체 검색 실패:', error);
      // 최종 백업: 기존 로컬 데이터 사용
      const backupStocks = localStockData.slice(0, 5);
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
