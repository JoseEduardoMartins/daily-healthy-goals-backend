import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkin.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'float', nullable: false })
  weight: number;

  @Column({ type: 'float', nullable: false })
  height: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @OneToMany(() => DailyCheckin, (checkin) => checkin.user)
  daily_checkins: DailyCheckin[];
}
