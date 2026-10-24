import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/createEmployeeDto';
import { EmployeesService } from './providers/employees.service';
import { PatchEmployeeDto } from './dtos/patchEmployeeDto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('employees')
@UseGuards(AuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(Role.ADMIN)
  @Post()
  public create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(createEmployeeDto);
  }

  @Roles(Role.ADMIN)
  @Patch('/:id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patchEmployeeDto: PatchEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(id, patchEmployeeDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findAll() {
    return this.employeesService.findAllEmployees();
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('/:id')
  public findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOneEmployee(id);
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  public remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.deleteEmployee(id);
  }
}
