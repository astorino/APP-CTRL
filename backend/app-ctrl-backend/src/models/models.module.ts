import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Category } from './category.entity';
import { Budget } from './budget.entity';
import { Report } from './report.entity';
import { Debt } from './debt.entity';
import { Installment } from './installment.entity';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { BudgetRepository } from '../repositories/budget.repository';
import { ReportRepository } from '../repositories/report.repository';
import { DebtRepository } from '../repositories/debt.repository';
import { InstallmentRepository } from '../repositories/installment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Category,
      Budget,
      Report,
      Debt,
      Installment,
    ]),
  ],
  providers: [
    TransactionRepository,
    CategoryRepository,
    BudgetRepository,
    ReportRepository,
    DebtRepository,
    InstallmentRepository,
  ],
  exports: [
    TypeOrmModule,
    TransactionRepository,
    CategoryRepository,
    BudgetRepository,
    ReportRepository,
    DebtRepository,
    InstallmentRepository,
  ],
})
export class ModelsModule {}