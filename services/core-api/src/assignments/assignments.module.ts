import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstateAssignment } from './entities/estate-assignment.entity';
import { Estate } from 'src/estates/estate.entity';
import { EstateAssignmentService } from './providers/estate-assignment.service';

@Module({
  controllers: [AssignmentsController],
  providers: [EstateAssignmentService],
  imports: [TypeOrmModule.forFeature([EstateAssignment, Estate])],
})
export class AssignmentsModule {}
