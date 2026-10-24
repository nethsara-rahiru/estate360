import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstateDto } from '../dtos/createEstateDto';
import { UpdateEstateDto } from '../dtos/updateEstateDto';
import { Repository } from 'typeorm';
import { Estate } from '../estate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Crop } from 'src/crop/crop.entity';
import { Owner } from 'src/owners/owner.entity';

@Injectable()
export class EstatesService {
  constructor(
    @InjectRepository(Estate)
    private readonly estatesRepository: Repository<Estate>,

    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  public async findAll() {
    return this.estatesRepository.find({
      relations: { owner: true, crop: true },
    });
  }

  public async findOne(id: string) {
    const estate = await this.estatesRepository.findOne({
      where: { id },
      relations: { owner: true, crop: true },
    });

    if (!estate) {
      throw new NotFoundException(`Estate with ID ${id} not found`);
    }

    return estate;
  }

  public async createEstate(createEstateDto: CreateEstateDto) {
    const cropId = createEstateDto.cropId ?? createEstateDto.crop;
    const ownerId = createEstateDto.ownerId ?? createEstateDto.owner;

    if (!cropId || !ownerId) {
      throw new BadRequestException('Both crop and owner IDs are required');
    }

    const existingCode = await this.estatesRepository.findOne({
      where: { code: createEstateDto.code },
    });
    if (existingCode) {
      throw new ConflictException('An estate with this code already exists');
    }

    const [crop, owner] = await Promise.all([
      this.cropRepository.findOne({ where: { id: cropId } }),
      this.ownerRepository.findOne({ where: { id: ownerId } }),
    ]);

    if (!crop) throw new NotFoundException('Crop not found');
    if (!owner) throw new NotFoundException('Owner not found');

    const estate = this.estatesRepository.create({
      owner,
      crop,
      name: createEstateDto.name,
      code: createEstateDto.code,
      location: createEstateDto.location,
      boundary: createEstateDto.boundary,
      status: createEstateDto.status,
    });

    return this.estatesRepository.save(estate);
  }

  public async updateEstate(id: string, updateEstateDto: UpdateEstateDto) {
    const estate = await this.findOne(id);

    const cropId = updateEstateDto.cropId ?? updateEstateDto.crop;
    if (cropId) {
      const crop = await this.cropRepository.findOne({ where: { id: cropId } });
      if (!crop) throw new NotFoundException('Crop not found');
      estate.crop = crop;
    }

    const ownerId = updateEstateDto.ownerId ?? updateEstateDto.owner;
    if (ownerId) {
      const owner = await this.ownerRepository.findOne({
        where: { id: ownerId },
      });
      if (!owner) throw new NotFoundException('Owner not found');
      estate.owner = owner;
    }

    if (updateEstateDto.name !== undefined) {
      estate.name = updateEstateDto.name;
    }
    if (updateEstateDto.code !== undefined) {
      estate.code = updateEstateDto.code;
    }
    if (updateEstateDto.location !== undefined) {
      estate.location = updateEstateDto.location;
    }
    if (updateEstateDto.boundary !== undefined) {
      estate.boundary = updateEstateDto.boundary;
    }
    if (updateEstateDto.status !== undefined) {
      estate.status = updateEstateDto.status;
    }

    return this.estatesRepository.save(estate);
  }

  public async deleteEstate(id: string) {
    const estate = await this.findOne(id);
    await this.estatesRepository.remove(estate);
    return { message: 'Estate deleted successfully' };
  }
}
