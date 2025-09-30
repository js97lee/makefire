import { useState } from 'react';
import { localStockData } from '../data/constants';
import { expandedStockDatabase, hybridStockSearch, searchStockAPI } from '../data/stockDatabase';

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
      console.log('API 전용 주식 검색 시작...');
      
      // API만 사용 - 로컬 DB 사용 안함
      const apiResults = await searchStockAPI(query);
      if (apiResults && apiResults.length > 0) {
        console.log(`API 검색 결과 (실제 배당률): ${apiResults.length}개`);
        setSearchResults(apiResults);
      } else {
        console.log('API에서 검색 결과를 찾을 수 없습니다.');
        setSearchResults([]);
      }
      
    } catch (error) {
      console.error('API 검색 실패:', error);
      setSearchResults([]);
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
