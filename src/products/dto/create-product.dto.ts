import { Type } from 'class-transformer';
import { IsString, Min, IsNumber } from 'class-validator';

export class CreateProductDto {

  @IsString()
  name: string

  @IsNumber({
    maxDecimalPlaces: 2
  })
  @Min(1)
  @Type(() => Number)
  price: number
}
