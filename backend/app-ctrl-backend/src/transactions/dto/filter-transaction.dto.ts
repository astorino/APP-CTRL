import { IsOptional, IsEnum, IsUUID, IsDate, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../../models/transaction.entity';

export class FilterTransactionDto {
  @IsEnum(TransactionType, { message: 'O tipo deve ser receita ou despesa' })
  @IsOptional()
  tipo?: TransactionType;

  @IsUUID(undefined, { message: 'A categoria deve ser um UUID válido' })
  @IsOptional()
  categoriaId?: string;

  @IsDate({ message: 'A data de início deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataInicio?: Date;

  @IsDate({ message: 'A data de fim deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataFim?: Date;

  @IsString({ message: 'O termo de busca deve ser uma string' })
  @IsOptional()
  search?: string;

  @IsNumber({}, { message: 'A página deve ser um número' })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsNumber({}, { message: 'O limite deve ser um número' })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}