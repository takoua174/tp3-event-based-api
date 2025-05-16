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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cvId: number;

  @Column()
  userId: number;

  @Column()
  operation: OperationEnum;

  @Column('json')
  details: any;

  @CreateDateColumn()
  timestamp: Date;
}
