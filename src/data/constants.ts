import { DividendFrequency } from '../types';

// 배당 빈도 옵션
export const dividendFrequencies: DividendFrequency[] = [
  { id: 'monthly', label: '매월', multiplier: 12 },
  { id: 'quarterly', label: '분기별', multiplier: 4 },
  { id: 'semiannual', label: '반기별', multiplier: 2 },
  { id: 'annual', label: '연간', multiplier: 1 }
];

// 로컬 주식 데이터
export const localStockData = [
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

// 기본 시나리오 설정
export const defaultScenarios = [
  { id: 'A', name: 'A', rate: 80, color: '#ff6600', active: true },
  { id: 'B', name: 'B', rate: 50, color: '#4a90e2', active: true },
  { id: 'C', name: 'C', rate: 30, color: '#50c878', active: false },
  { id: 'D', name: 'D', rate: 20, color: '#9b59b6', active: false }
];
