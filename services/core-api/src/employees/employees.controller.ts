import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/createEmployeeDto';
import { EmployeesService } from './providers/employees.service';
import { PatchEmployeeDto } from './dtos/patchEmployeeDto';

@Controller('employees')
export class EmployeesController {
  constructor(@Inject() private readonly employeesService: EmployeesService) {}

  @Post()
  public createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(createEmployeeDto);
  }

  @Patch('/:id')
  public updateEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patchEmployeeDto: PatchEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(id, patchEmployeeDto);
  }
}
