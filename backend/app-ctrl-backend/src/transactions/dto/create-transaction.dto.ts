import { IsNotEmpty, IsNumber, IsOptional, IsUUID, IsEnum, IsDate, IsString, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../../models/transaction.entity';

export class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;
}

export class CreateTransactionDto {
  @IsEnum(TransactionType, { message: 'O tipo deve ser receita ou despesa' })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  tipo: TransactionType;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  valor: number;

  @IsDate({ message: 'A data deve ser uma data válida' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'A data é obrigatória' })
  data: Date;

  @IsUUID(undefined, { message: 'A categoria deve ser um UUID válido' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoriaId: string;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  descricao?: string;

  @IsString({ message: 'O método de pagamento deve ser uma string' })
  @IsOptional()
  metodoPagamento?: string;

  @IsArray({ message: 'As tags devem ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  @IsOptional()
  tags?: string[];

  @IsBoolean({ message: 'O campo recorrente deve ser um booleano' })
  @IsOptional()
  recorrente?: boolean;

  @IsArray({ message: 'Os anexos devem ser um array' })
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  anexos?: AttachmentDto[];
}