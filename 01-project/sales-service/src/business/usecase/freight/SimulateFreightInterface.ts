import { FreightCalculatorInput } from '../../entities/dto/FreightCalculatorInput';
import { FreightCalculatorOutput } from '../../entities/dto/FreightCalculatorOutput';

export const SIMULATE_FREIGHT = 'SIMULATE FREIGHT';

export interface SimulateFreightInterface {
  execute(input: FreightCalculatorInput): Promise<FreightCalculatorOutput>;
}
