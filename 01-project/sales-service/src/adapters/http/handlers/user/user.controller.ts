import { Controller, UsePipes, ValidationPipe, UseFilters, Inject, Get, Param } from '@nestjs/common';
import { BusinessExceptionFilter } from '../../exceptions/BusinessExceptionFilter';
import { LIST_USER_ORDERS, ListUserOrdersInterface } from '../../../../business/usecase/order/ListUserOrdersInterface';
import { ListUserOrdersOutput } from '../../../../business/entities/dto/ListUserOrdersOutput';
import { ListUserOrdersInput } from '../../../../business/entities/dto/ListUserOrdersInput';

@Controller({
  path: 'users',
  version: '1',
})
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BusinessExceptionFilter)
export class UserControllerV1 {
  constructor(@Inject(LIST_USER_ORDERS) private readonly listUsersOrders: ListUserOrdersInterface) {}

  @Get(':cpf/orders')
  async get(@Param('cpf') cpf: string): Promise<ListUserOrdersOutput> {
    return this.listUsersOrders.execute(new ListUserOrdersInput(cpf));
  }
}
