import { IsString, IsOptional } from 'class-validator';

export class UpdateWorkflowDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
