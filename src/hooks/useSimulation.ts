import { useMemo } from 'react';
import { SimulationScenario, SimulationInputs, SimulationResult } from '../types';
import { calculateMonthsToTarget } from '../utils';

export const useSimulation = (
  simulationInputs: SimulationInputs,
  scenarios: SimulationScenario[]
) => {
  const simulationResults: SimulationResult[] = useMemo(() => {
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

  const isValidSimulation = useMemo(() => {
    return simulationInputs.initialCapital > 0 && 
           simulationInputs.monthlyDividend > 0 && 
           simulationInputs.targetAmount > 0;
  }, [simulationInputs]);

  return {
    simulationResults,
    isValidSimulation
  };
};
