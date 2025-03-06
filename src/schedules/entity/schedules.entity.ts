import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'schedules' })
export class ScheduleModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  corporation_id: string;

  @Column({ type: 'uuid' })
  worker_id: string;

  @Column({ type: 'uuid' })
  client_id: string;

  @Column({ type: 'simple-array' })
  service_ids: string[];

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  start_at: string;

  @Column({ type: 'time' })
  end_at: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
