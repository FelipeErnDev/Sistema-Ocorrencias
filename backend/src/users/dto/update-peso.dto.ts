import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePesoDto {
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  peso: number;
}
