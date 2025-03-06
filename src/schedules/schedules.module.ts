import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '../util/db/typeorm/transactions.service';
import { ScheduleModel } from './entity/schedules.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleModel]),  // Isso importa o repositório para o módulo
  ],
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    TransactionService,
  ],
})
export class SchedulesModule { }
