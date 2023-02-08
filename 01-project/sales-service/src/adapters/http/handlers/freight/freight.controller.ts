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
import { FreightServiceInterface, FREIGHT_SERVICE } from '../../../../business/service/FreightServiceInterface';
import { FreightCalculatorOutput } from '../../../../business/entities/dto/FreightCalculatorOutput';
import { FreightCalculatorInput } from '../../../../business/entities/dto/FreightCalculatorInput';

@Controller({
  path: 'freight',
  version: '1',
})
@UseFilters(BusinessExceptionFilter)
export class FreightControllerV1 {
  constructor(@Inject(FREIGHT_SERVICE) private readonly freightService: FreightServiceInterface) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async calculate(@Body() body: FreightCalculatorInput): Promise<FreightCalculatorOutput> {
    return this.freightService.calculateByProducts(body.items, 1000);
  }
}
