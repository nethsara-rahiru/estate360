import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstateAssignment } from './entities/estate-assignment.entity';
import { EstateAssignmentService } from './providers/estate-assignment.service';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';

@Module({
  controllers: [AssignmentsController],
  providers: [EstateAssignmentService],
  imports: [TypeOrmModule.forFeature([EstateAssignment, Employee, Estate])],
})
export class AssignmentsModule {}
