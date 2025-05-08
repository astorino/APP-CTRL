import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { DebtNotificationService } from './notification.service';
import { ModelsModule } from '../models/models.module';

@Module({
  imports: [
    ModelsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [DebtsController],
  providers: [DebtsService, DebtNotificationService],
  exports: [DebtsService, DebtNotificationService],
})
export class DebtsModule {}