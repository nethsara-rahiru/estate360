import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './providers/employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [TypeOrmModule.forFeature([Employee]), AuthModule],
})
export class EmployeesModule {}
