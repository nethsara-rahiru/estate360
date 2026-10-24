import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../attendance.entity';
import {
  CheckInAttendanceDto,
  CheckOutAttendanceDto,
} from '../dtos/attendance.dto';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,

    @InjectRepository(Estate)
    private readonly estatesRepo: Repository<Estate>,
  ) {}

  public async checkIn(dto: CheckInAttendanceDto) {
    const [worker, estate] = await Promise.all([
      this.employeesRepo.findOne({ where: { id: dto.workerId } }),
      this.estatesRepo.findOne({ where: { id: dto.estateId } }),
    ]);

    if (!worker) throw new NotFoundException('Worker not found');
    if (!estate) throw new NotFoundException('Estate not found');

    const date = dto.date ? new Date(dto.date) : new Date();
    const checkIn = dto.checkIn ? new Date(dto.checkIn) : new Date();

    const attendance = this.attendanceRepo.create({
      worker,
      estate,
      date,
      checkIn,
      status: dto.status ?? 'present',
    });

    return this.attendanceRepo.save(attendance);
  }

  public async checkOut(id: string, dto: CheckOutAttendanceDto) {
    const record = await this.attendanceRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    record.checkOut = dto.checkOut ? new Date(dto.checkOut) : new Date();
    if (dto.status) {
      record.status = dto.status;
    }

    return this.attendanceRepo.save(record);
  }

  public async findAll(filter?: {
    workerId?: string;
    estateId?: string;
    date?: string;
  }) {
    const query = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.worker', 'worker')
      .leftJoinAndSelect('attendance.estate', 'estate')
      .orderBy('attendance.checkIn', 'DESC');

    if (filter?.workerId) {
      query.andWhere('attendance.worker_id = :workerId', {
        workerId: filter.workerId,
      });
    }
    if (filter?.estateId) {
      query.andWhere('attendance.estate_id = :estateId', {
        estateId: filter.estateId,
      });
    }
    if (filter?.date) {
      query.andWhere('attendance.date = :date', { date: filter.date });
    }

    return query.getMany();
  }
}
