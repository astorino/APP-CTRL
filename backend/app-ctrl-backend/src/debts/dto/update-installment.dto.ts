import { 
  IsOptional, 
  IsNumber, 
  IsDate, 
  IsString, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInstallmentDto {
  @ApiPropertyOptional({ 
    description: 'Valor da parcela', 
    example: 100.50 
  })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0, { message: 'O valor deve ser maior ou igual a zero' })
  @IsOptional()
  valor?: number;

  @ApiPropertyOptional({ 
    description: 'Data de vencimento da parcela', 
    example: '2025-06-15' 
  })
  @IsDate({ message: 'A data de vencimento deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataVencimento?: Date;

  @ApiPropertyOptional({ 
    description: 'Data de pagamento da parcela', 
    example: '2025-06-10' 
  })
  @IsDate({ message: 'A data de pagamento deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataPagamento?: Date;

  @ApiPropertyOptional({ 
    description: 'Observação sobre a parcela', 
    example: 'Pagamento via PIX' 
  })
  @IsString({ message: 'A observação deve ser uma string' })
  @IsOptional()
  observacao?: string;
}