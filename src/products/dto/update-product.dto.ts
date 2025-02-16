import { Type } from 'class-transformer';
import { IsString, Min, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductDto {

  @IsNumber()
  @IsPositive()
  id: number

  @IsString()
  name: string

  @IsNumber({
    maxDecimalPlaces: 2
  })
  @Min(1)
  @Type(() => Number)
  price: number
}
