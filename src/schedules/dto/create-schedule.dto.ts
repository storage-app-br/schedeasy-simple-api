import { ScheduleModel } from "../entity/schedules.entity";

export class CreateScheduleDto implements Omit<ScheduleModel, 'id' | 'date'> {
  corporation_id: string;
  worker_id: string;
  client_id: string;
  service_ids: string[];
  date: Date;
  start_at: string;
  end_at: string;
  duration: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}
