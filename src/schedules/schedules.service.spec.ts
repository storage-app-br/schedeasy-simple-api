import { TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TESTING_MODULE } from '../util/db/typeorm/__tests__/testing.module';
import { TransactionService } from '../util/db/typeorm/transactions.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleModel } from './entity/schedules.entity';
import { SchedulesService } from './schedules.service';

describe('SchedulesService', () => {
  let schedulesService: SchedulesService;
  let dataSource: DataSource;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await TESTING_MODULE({
      providers: [SchedulesService, TransactionService],
    });
    schedulesService = module.get<SchedulesService>(SchedulesService);
    dataSource = module.get<DataSource>(DataSource);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  afterEach(async () => {
    // Limpar os dados após cada teste
    await dataSource.getRepository(ScheduleModel).clear();
  });

  afterAll(async () => {
    // Fechar a conexão com o banco de dados após todos os testes
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(schedulesService).toBeDefined();
  });

  it('should create a schedule', async () => {
    const createScheduleDto: CreateScheduleDto = {
      corporation_id: '1',
      worker_id: '1',
      client_id: '1',
      service_ids: ['1'],
      date: new Date(),
      start_at: '08:00',
      end_at: '09:00',
      duration: 60,
      price: 100,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const rollbackSpy = jest.spyOn(transactionService, 'rollbackTransaction');

    // Chama o método de criação
    await schedulesService.create(createScheduleDto);

    const schedules = await schedulesService.findAll();
    expect(schedules).toHaveLength(1);  // Verifica se foi criado um agendamento

    // Verifica se o rollback não foi chamado (pois não houve erro)
    expect(rollbackSpy).not.toHaveBeenCalled();
  });

  it('should find all schedules', async () => {
    const result = await schedulesService.findAll();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should update a schedule', async () => {
    // Cria um agendamento inicial
    const createScheduleDto: CreateScheduleDto = {
      corporation_id: '1',
      worker_id: '1',
      client_id: '1',
      service_ids: ['1'],
      date: new Date(),
      start_at: '08:00',
      end_at: '09:00',
      duration: 60,
      price: 100,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await schedulesService.create(createScheduleDto);
    const createdSchedule = (await schedulesService.findAll())[0];

    const updateScheduleDto = {
      corporation_id: '2',
      worker_id: '2',
      client_id: '2',
      service_ids: ['2'],
      date: new Date(),
      start_at: '09:00',
      end_at: '10:00',
      duration: 90,
      price: 120,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updatedSchedule = await schedulesService.update(createdSchedule.id, updateScheduleDto);

    expect(updatedSchedule.corporation_id).toBe(updateScheduleDto.corporation_id);
    expect(updatedSchedule.worker_id).toBe(updateScheduleDto.worker_id);
  });

  it('should remove a schedule', async () => {
    // Cria um agendamento
    const createScheduleDto: CreateScheduleDto = {
      corporation_id: '1',
      worker_id: '1',
      client_id: '1',
      service_ids: ['1'],
      date: new Date(),
      start_at: '08:00',
      end_at: '09:00',
      duration: 60,
      price: 100,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await schedulesService.create(createScheduleDto);
    const createdSchedule = (await schedulesService.findAll())[0];

    await schedulesService.remove(createdSchedule.id);

    const schedules = await schedulesService.findAll();
    expect(schedules).toHaveLength(0);
  });
});
