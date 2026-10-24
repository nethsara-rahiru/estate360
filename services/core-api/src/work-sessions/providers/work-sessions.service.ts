import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkSession } from '../work-session.entity';
import {
  CreateWorkSessionDto,
  EndWorkSessionDto,
} from '../dtos/work-session.dto';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';

@Injectable()
export class WorkSessionsService {
  constructor(
    @InjectRepository(WorkSession)
    private readonly sessionsRepository: Repository<WorkSession>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,

    @InjectRepository(Estate)
    private readonly estatesRepository: Repository<Estate>,
  ) {}

  public async startSession(createDto: CreateWorkSessionDto) {
    const [worker, estate] = await Promise.all([
      this.employeesRepository.findOne({ where: { id: createDto.workerId } }),
      this.estatesRepository.findOne({ where: { id: createDto.estateId } }),
    ]);

    if (!worker) throw new NotFoundException('Worker not found');
    if (!estate) throw new NotFoundException('Estate not found');

    const session = this.sessionsRepository.create({
      worker,
      estate,
      startTime: createDto.startTime
        ? new Date(createDto.startTime)
        : new Date(),
      status: createDto.status ?? 'active',
    });

    return this.sessionsRepository.save(session);
  }

  public async endSession(id: string, endDto: EndWorkSessionDto) {
    const session = await this.sessionsRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Work session with ID ${id} not found`);
    }

    session.endTime = endDto.endTime ? new Date(endDto.endTime) : new Date();
    session.status = endDto.status ?? 'completed';

    return this.sessionsRepository.save(session);
  }

  public async findAll(filter?: {
    workerId?: string;
    estateId?: string;
    status?: string;
  }) {
    const query = this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.worker', 'worker')
      .leftJoinAndSelect('session.estate', 'estate')
      .orderBy('session.startTime', 'DESC');

    if (filter?.workerId) {
      query.andWhere('session.worker_id = :workerId', {
        workerId: filter.workerId,
      });
    }
    if (filter?.estateId) {
      query.andWhere('session.estate_id = :estateId', {
        estateId: filter.estateId,
      });
    }
    if (filter?.status) {
      query.andWhere('session.status = :status', { status: filter.status });
    }

    return query.getMany();
  }

  public async findOne(id: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: { worker: true, estate: true },
    });
    if (!session) {
      throw new NotFoundException(`Work session with ID ${id} not found`);
    }
    return session;
  }
}
