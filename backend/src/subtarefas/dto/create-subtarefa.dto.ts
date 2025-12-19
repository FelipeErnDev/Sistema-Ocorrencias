import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateSubtarefaDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsInt()
  @IsOptional()
  responsavelId?: number;
}
