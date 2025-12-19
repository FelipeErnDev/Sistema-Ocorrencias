import { IsString, IsOptional } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
