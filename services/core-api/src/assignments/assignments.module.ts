import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstateAssignment } from './entities/estate-assignment.entity';
import { Estate } from 'src/estates/estate.entity';

@Module({
  controllers: [AssignmentsController],
  providers: [],
  imports: [TypeOrmModule.forFeature([EstateAssignment, Estate])],
})
export class AssignmentsModule {}
