import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeePaymentDetail } from '../payment-details.entity';
import { CreatePaymentDetailDto } from '../dtos/createPaymentDetail.dto';
import { UpdatePaymentDetailDto } from '../dtos/updatePaymentDetail.dto';
import { Employee } from 'src/employees/employee.entity';

@Injectable()
export class PaymentDetailsService {
  constructor(
    @InjectRepository(EmployeePaymentDetail)
    private readonly paymentDetailsRepository: Repository<EmployeePaymentDetail>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  public async create(createDto: CreatePaymentDetailDto) {
    const employee = await this.employeesRepository.findOne({
      where: { id: createDto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createDto.employeeId} not found`,
      );
    }

    const existing = await this.paymentDetailsRepository.findOne({
      where: { employee: { id: createDto.employeeId } },
    });

    if (existing) {
      throw new ConflictException(
        'Payment details already exist for this employee',
      );
    }

    const paymentDetail = this.paymentDetailsRepository.create({
      employee,
      paymentFrequency: createDto.paymentFrequency,
      bankName: createDto.bankName,
      accountNumber: createDto.accountNumber,
      accountName: createDto.accountName,
      branch: createDto.branch,
      isActive: createDto.isActive ?? true,
    });

    return this.paymentDetailsRepository.save(paymentDetail);
  }

  public async findAll() {
    return this.paymentDetailsRepository.find({
      relations: { employee: true },
    });
  }

  public async findByEmployeeId(employeeId: string) {
    const detail = await this.paymentDetailsRepository.findOne({
      where: { employee: { id: employeeId } },
      relations: { employee: true },
    });

    if (!detail) {
      throw new NotFoundException(
        `Payment details for employee ID ${employeeId} not found`,
      );
    }

    return detail;
  }

  public async update(id: string, updateDto: UpdatePaymentDetailDto) {
    const detail = await this.paymentDetailsRepository.findOne({
      where: { id },
      relations: { employee: true },
    });

    if (!detail) {
      throw new NotFoundException(`Payment detail with ID ${id} not found`);
    }

    if (updateDto.paymentFrequency !== undefined) {
      detail.paymentFrequency = updateDto.paymentFrequency;
    }
    if (updateDto.bankName !== undefined) {
      detail.bankName = updateDto.bankName;
    }
    if (updateDto.accountNumber !== undefined) {
      detail.accountNumber = updateDto.accountNumber;
    }
    if (updateDto.accountName !== undefined) {
      detail.accountName = updateDto.accountName;
    }
    if (updateDto.branch !== undefined) {
      detail.branch = updateDto.branch;
    }
    if (updateDto.isActive !== undefined) {
      detail.isActive = updateDto.isActive;
    }

    return this.paymentDetailsRepository.save(detail);
  }
}
