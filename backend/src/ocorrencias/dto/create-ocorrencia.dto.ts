import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOcorrenciaDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  setorId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  colaboradorId?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  autoAtribuir?: boolean;

  @IsOptional()
  @IsString()
  documentacaoUrl?: string;

  @IsOptional()
  @IsString()
  descricaoExecucao?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  workflowId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  statusId?: number;
}

export class CreateOcorrenciaPublicDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  colaboradorNome: string;

  @IsInt()
  @Type(() => Number)
  setorId: number;

  @IsOptional()
  @IsString()
  documentacaoUrl?: string;

  @IsOptional()
  @IsString()
  descricaoExecucao?: string;
}
