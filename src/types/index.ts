// 타입 정의
export interface DividendFrequency {
  id: string;
  label: string;
  multiplier: number;
}

export interface StockHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  price: number;
  dividendYield: number;
  frequency: string;
  manualDividend?: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  rate: number;
  color: string;
  active: boolean;
}

export interface SimulationInputs {
  initialCapital: number;
  monthlyDividend: number;
  targetAmount: number;
}

export interface SimulationResult extends SimulationScenario {
  months: number;
  years: number;
  remainingMonths: number;
  history: Array<{
    month: number;
    capital: number;
    monthlyDividend: number;
  }>;
  finalCapital: number;
  displayText: string;
}

export type ViewMode = 'monthly' | 'quarterly' | 'halfyearly' | 'yearly';

export type TabType = 'intro' | 'portfolio' | 'simulation';
