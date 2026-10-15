import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createEstateAssignmentDto } from '../dtos/estate-assignment/createEstateAssignmentDto';
import { Estate } from 'src/estates/estate.entity';
import { Employee } from 'src/employees/employee.entity';
import { EstateAssignment } from '../entities/estate-assignment.entity';

@Injectable()
export class EstateAssignmentService {
  constructor(
    @InjectRepository(EstateAssignment)
    private readonly estateAssignementRepository: Repository<EstateAssignment>,

    @InjectRepository(Estate)
    private readonly estateRepository: Repository<Estate>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  public async create(createEstateAssignmentDto: createEstateAssignmentDto) {
    const estate = await this.estateRepository.findOne({
      where: { id: createEstateAssignmentDto.estateId },
    });

    if (!estate) throw new NotFoundException('estate not found');

    const employee = await this.employeesRepository.findOne({
      where: { id: createEstateAssignmentDto.employeeId },
    });

    if (!employee) throw new NotFoundException('employee not found');

    const assignment = this.estateAssignementRepository.create({
      startDate: createEstateAssignmentDto.startDate,
      endDate: createEstateAssignmentDto.endDate,
      estate,
      employee,
      role: createEstateAssignmentDto.role,
    });

    return this.estateAssignementRepository.save(assignment);
  }
}
