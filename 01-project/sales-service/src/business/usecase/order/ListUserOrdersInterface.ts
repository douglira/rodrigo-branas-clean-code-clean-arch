import { ListUserOrdersInput } from '../../entities/dto/ListUserOrdersInput';
import { ListUserOrdersOutput } from '../../entities/dto/ListUserOrdersOutput';

export const LIST_USER_ORDERS = 'LIST USER ORDERS';

export interface ListUserOrdersInterface {
  execute(input: ListUserOrdersInput): Promise<ListUserOrdersOutput>;
}
