import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsDate, 
  IsArray, 
  ValidateNested, 
  Min, 
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInstallmentDto {
  @ApiProperty({ description: 'Número da parcela', example: 1 })
  @IsNumber({}, { message: 'O número da parcela deve ser um número' })
  @IsNotEmpty({ message: 'O número da parcela é obrigatório' })
  @Min(1, { message: 'O número da parcela deve ser maior ou igual a 1' })
  numero: number;

  @ApiProperty({ description: 'Valor da parcela', example: 100.50 })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @Min(0, { message: 'O valor deve ser maior ou igual a zero' })
  valor: number;

  @ApiProperty({ description: 'Data de vencimento da parcela', example: '2025-06-15' })
  @IsDate({ message: 'A data de vencimento deve ser uma data válida' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'A data de vencimento é obrigatória' })
  dataVencimento: Date;

  @ApiPropertyOptional({ description: 'Observação sobre a parcela', example: 'Pagamento via PIX' })
  @IsString({ message: 'A observação deve ser uma string' })
  @IsOptional()
  observacao?: string;
}

export class CreateDebtDto {
  @ApiProperty({ description: 'Nome da dívida', example: 'Empréstimo Pessoal' })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiPropertyOptional({ description: 'Descrição da dívida', example: 'Empréstimo para reforma da casa' })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Valor total da dívida', example: 5000 })
  @IsNumber({}, { message: 'O valor total deve ser um número' })
  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  @Min(0, { message: 'O valor total deve ser maior ou igual a zero' })
  valorTotal: number;

  @ApiProperty({ description: 'Data de início da dívida', example: '2025-05-01' })
  @IsDate({ message: 'A data de início deve ser uma data válida' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  dataInicio: Date;

  @ApiPropertyOptional({ description: 'Data de fim prevista da dívida', example: '2026-05-01' })
  @IsDate({ message: 'A data de fim deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataFim?: Date;

  @ApiProperty({ 
    description: 'Lista de parcelas da dívida',
    type: [CreateInstallmentDto],
    example: [
      { numero: 1, valor: 500, dataVencimento: '2025-06-01' },
      { numero: 2, valor: 500, dataVencimento: '2025-07-01' }
    ]
  })
  @IsArray({ message: 'As parcelas devem ser um array' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma parcela' })
  @Type(() => CreateInstallmentDto)
  parcelas: CreateInstallmentDto[];
}