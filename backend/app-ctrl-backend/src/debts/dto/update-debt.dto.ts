import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDebtDto } from './create-debt.dto';

// Omitimos as parcelas do UpdateDebtDto porque elas serão gerenciadas separadamente
export class UpdateDebtDto extends PartialType(
  OmitType(CreateDebtDto, ['parcelas'] as const),
) {}