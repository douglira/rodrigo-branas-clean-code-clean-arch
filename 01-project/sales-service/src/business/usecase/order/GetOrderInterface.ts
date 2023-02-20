import { GetOrderInput } from '../../entities/dto/GetOrderInput';
import { GetOrderOutput } from '../../entities/dto/GetOrderOutput';

export const GET_ORDER = 'GET_ORDER';

export interface GetOrderInterface {
  execute(input: GetOrderInput): Promise<GetOrderOutput>;
}
