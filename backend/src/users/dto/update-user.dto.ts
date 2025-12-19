import { IsString, IsEmail, IsOptional, IsNumber, Min, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  perfil?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  setorId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  peso?: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  workflowIds?: number[];
}
