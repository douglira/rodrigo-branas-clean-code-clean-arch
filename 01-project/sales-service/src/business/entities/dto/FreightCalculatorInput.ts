import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class FreightItemInput {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  depth: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  quantity: number;
}

export class FreightCalculatorInput {
  @IsString()
  addresseePostalCode: string;

  @ValidateNested({ each: true })
  @Type(() => Array<FreightItemInput>)
  items = new Array<FreightItemInput>();

  constructor(addresseePostalCode?: string, items: Array<FreightItemInput> = []) {
    this.addresseePostalCode = addresseePostalCode;
    this.items = items;
  }
}
