import { 
  IsOptional, 
  IsEnum, 
  IsDate, 
  IsString, 
  IsNumber 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DebtStatus } from '../../models/debt.entity';

export class FilterDebtDto {
  @ApiPropertyOptional({ 
    description: 'Status da dívida', 
    enum: DebtStatus,
    example: DebtStatus.IN_PROGRESS 
  })
  @IsEnum(DebtStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: DebtStatus;

  @ApiPropertyOptional({ 
    description: 'Data de início para filtro', 
    example: '2025-01-01' 
  })
  @IsDate({ message: 'A data de início deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataInicio?: Date;

  @ApiPropertyOptional({ 
    description: 'Data de fim para filtro', 
    example: '2025-12-31' 
  })
  @IsDate({ message: 'A data de fim deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataFim?: Date;

  @ApiPropertyOptional({ 
    description: 'Termo de busca para nome ou descrição', 
    example: 'empréstimo' 
  })
  @IsString({ message: 'O termo de busca deve ser uma string' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Número da página para paginação', 
    example: 1,
    default: 1 
  })
  @IsNumber({}, { message: 'A página deve ser um número' })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Limite de itens por página', 
    example: 20,
    default: 20 
  })
  @IsNumber({}, { message: 'O limite deve ser um número' })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}