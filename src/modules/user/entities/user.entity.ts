import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../../auth/enums/roles.enum';
import { BaseEntity } from '../../../common/entities/base.entity';
@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  declare id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: Roles;
}
