import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

describe('SchedulesController', () => {
  let controller: SchedulesController;
  let service: SchedulesService;

  beforeEach(() => {
    // Mock do SchedulesService
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    controller = new SchedulesController(service); // Instanciando diretamente o controller com o mock
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call SchedulesService.create when create is called', async () => {
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

    const result = { identifiers: [{ id: '1' }], generatedMaps: [], raw: [] };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    const response = await controller.create(createScheduleDto);
    expect(service.create).toHaveBeenCalledWith(createScheduleDto);
    expect(response).toEqual(result);
  });

  it('should call SchedulesService.findAll when findAll is called', async () => {
    const result = [{ id: '1', corporation_id: '1' } as any];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    const schedules = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(schedules).toEqual(result);
  });

  it('should call SchedulesService.findOne when findOne is called with valid UUID', async () => {
    const result = { id: '1', corporation_id: '1' } as any;
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    const schedule = await controller.findOne('valid-uuid');
    expect(service.findOne).toHaveBeenCalledWith('valid-uuid');
    expect(schedule).toEqual(result);
  });

  it('should call SchedulesService.update when update is called with valid UUID and update data', async () => {
    const updateScheduleDto: UpdateScheduleDto = {
      corporation_id: '2',
      worker_id: '2',
      client_id: '2',
      service_ids: ['2'],
      date: new Date(),
      start_at: '09:00',
      end_at: '10:00',
      duration: 60,
      price: 120,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = { id: '1', ...updateScheduleDto } as any;
    jest.spyOn(service, 'update').mockResolvedValue(result);

    const updatedSchedule = await controller.update('valid-uuid', updateScheduleDto);
    expect(service.update).toHaveBeenCalledWith('valid-uuid', updateScheduleDto);
    expect(updatedSchedule).toEqual(result);
  });

  it('should call SchedulesService.remove when remove is called with valid UUID', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue({} as any);

    await controller.remove('valid-uuid');
    expect(service.remove).toHaveBeenCalledWith('valid-uuid');
  });
});
