import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dtos/createEmployeeDto';
import { PatchEmployeeDto } from '../dtos/patchEmployeeDto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  public async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const existing = await this.employeesRepository.findOne({
      where: [
        { employeeCode: createEmployeeDto.employeeCode },
        { nic: createEmployeeDto.nic },
      ],
    });

    if (existing) {
      throw new ConflictException(
        'An employee with this employee code or NIC already exists',
      );
    }

    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      dateOfBirth: createEmployeeDto.dateOfBirth ?? createEmployeeDto.dob,
    });
    return this.employeesRepository.save(employee);
  }

  public async updateEmployee(id: string, patchEmployeeDto: PatchEmployeeDto) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('employee not found');

    Object.assign(employee, patchEmployeeDto);
    if (
      patchEmployeeDto.dateOfBirth !== undefined ||
      patchEmployeeDto.dob !== undefined
    ) {
      employee.dateOfBirth =
        patchEmployeeDto.dateOfBirth ?? patchEmployeeDto.dob;
    }

    return this.employeesRepository.save(employee);
  }

  public async findAllEmployees() {
    return this.employeesRepository.find();
  }

  public async findOneEmployee(id: string) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('employee not found');

    return employee;
  }

  public async deleteEmployee(id: string) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('employee not found');

    await this.employeesRepository.remove(employee);

    return { message: 'employee deleted successfully' };
  }
}
