import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleModel } from './entity/schedules.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(ScheduleModel)
    private readonly scheduleRepository: Repository<ScheduleModel>,
    // private readonly transactionService: TransactionService,
  ) { }

  async create({ date, ...createScheduleDto }: CreateScheduleDto) {
    // try {
    //   // Inicia a transação
    //   await this.transactionService.startTransaction();

    //   // Adiciona a primeira operação à transação
    //   await this.transactionService.addToTransaction(() =>
    //     this.scheduleRepository.insert({ ...createScheduleDto, date: date.toISOString() })
    //   );

    //   // Adiciona mais operações à mesma transação, em outra parte do código
    //   await this.transactionService.addToTransaction(() =>
    //     this.scheduleRepository.findOneByOrFail({ id: 'invalid' })  // Vai falhar
    //   );

    //   // Se tudo deu certo, faz o commit da transação
    //   await this.transactionService.commitTransaction();
    // } catch (error) {
    //   // Se algo falhou, faz o rollback
    //   await this.transactionService.rollbackTransaction();
    //   throw error;
    // }
    return await this.scheduleRepository.insert({ ...createScheduleDto, date: date.toISOString() });
  }

  async findAll() {
    return await this.scheduleRepository.find();
  }

  async findOne(id: string) {
    return await this.scheduleRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.findOneByOrFail({ id });
    schedule.corporation_id = updateScheduleDto.corporation_id ?? schedule.corporation_id;
    schedule.worker_id = updateScheduleDto.worker_id ?? schedule.worker_id;
    schedule.client_id = updateScheduleDto.client_id ?? schedule.client_id;
    schedule.service_ids = updateScheduleDto.service_ids ?? schedule.service_ids;
    schedule.date = updateScheduleDto.date ? updateScheduleDto.date.toISOString() : schedule.date;
    schedule.start_at = updateScheduleDto.start_at ?? schedule.start_at;
    schedule.end_at = updateScheduleDto.end_at ?? schedule.end_at;
    schedule.duration = updateScheduleDto.duration ?? schedule.duration;
    schedule.price = updateScheduleDto.price ?? schedule.price;
    this.scheduleRepository.save(schedule);
    return await this.scheduleRepository.save(schedule);
  }

  async remove(id: string) {
    return await this.scheduleRepository.delete(id);
  }
}
