import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Category } from './category.entity';
import { Budget } from './budget.entity';
import { Report } from './report.entity';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { BudgetRepository } from '../repositories/budget.repository';
import { ReportRepository } from '../repositories/report.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Category,
      Budget,
      Report,
    ]),
  ],
  providers: [
    TransactionRepository,
    CategoryRepository,
    BudgetRepository,
    ReportRepository,
  ],
  exports: [
    TypeOrmModule,
    TransactionRepository,
    CategoryRepository,
    BudgetRepository,
    ReportRepository,
  ],
})
export class ModelsModule {}