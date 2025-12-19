import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOcorrenciaDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  setorId?: number;

  // 👇 ADICIONE ESTES CAMPOS
  @IsOptional()
  @IsString()
  documentacaoUrl?: string;

  @IsOptional()
  @IsString()
  descricaoExecucao?: string;
}
