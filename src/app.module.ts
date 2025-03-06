import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule } from './config-module/config.module';
import { DatabaseModule } from './db-module/db.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot(),
    DatabaseModule,
    SchedulesModule
  ]
})
export class AppModule { }
