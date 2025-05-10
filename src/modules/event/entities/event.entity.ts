export class Event {}
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cvId: string;

  @Column()
  userId: string;

  @Column()
  operation: string;

  @Column('json')
  details: any;

  @CreateDateColumn()
  timestamp: Date;
}
