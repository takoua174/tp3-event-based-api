import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
@Entity('cvs')
export class CvEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  userId: string;
  @Column()
  age: number;

  @Column()
  cin: string;

  @Column()
  job: string;
}
