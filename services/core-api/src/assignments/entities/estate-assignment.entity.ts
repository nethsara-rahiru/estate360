import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity({ name: 'estate-assignment' })
export class EstateAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'estate_id' })
  estateId!: string;

  @Column({ name: 'employee_id' })
  employeeId!: string;

  @Column({ type: 'enum', enum: Role })
  role!: Role;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
