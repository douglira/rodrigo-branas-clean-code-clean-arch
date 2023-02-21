import {
  Controller,
  Post,
  Body,
  Inject,
  UsePipes,
  ValidationPipe,
  UseFilters,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessExceptionFilter } from '../../exceptions/BusinessExceptionFilter';
import { FreightCalculatorOutput } from '../../../../business/entities/dto/FreightCalculatorOutput';
import { FreightCalculatorInput } from '../../../../business/entities/dto/FreightCalculatorInput';
import {
  SIMULATE_FREIGHT,
  SimulateFreightInterface,
} from '../../../../business/usecase/freight/SimulateFreightInterface';

@Controller({
  path: 'freight',
  version: '1',
})
@UseFilters(BusinessExceptionFilter)
export class FreightControllerV1 {
  constructor(@Inject(SIMULATE_FREIGHT) private readonly simulateFreight: SimulateFreightInterface) {}

  @Post('simulate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async simulate(@Body() body: FreightCalculatorInput): Promise<FreightCalculatorOutput> {
    return this.simulateFreight.execute(body);
  }
}
