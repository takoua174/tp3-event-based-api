export class Event {}
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { OperationEnum } from '../enums/operation.enum';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cvId: string;

  @Column()
  userId: string;

  @Column()
  operation: OperationEnum;

  @Column('json')
  details: any;

  @CreateDateColumn()
  timestamp: Date;
}
