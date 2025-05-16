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
  @PrimaryGeneratedColumn('increment')
  declare id: number;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  userId: number;
  @Column()
  age: number;

  @Column()
  cin: string;

  @Column()
  job: string;
}
