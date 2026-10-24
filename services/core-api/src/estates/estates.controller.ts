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
import { CreateEstateDto } from './dtos/createEstateDto';
import { UpdateEstateDto } from './dtos/updateEstateDto';
import { EstatesService } from './providers/estates.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('estates')
@UseGuards(AuthGuard, RolesGuard)
export class EstatesController {
  constructor(private readonly estatesService: EstatesService) {}

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findAll() {
    return this.estatesService.findAll();
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get(':id')
  public findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estatesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post()
  public create(@Body() createEstateDto: CreateEstateDto) {
    return this.estatesService.createEstate(createEstateDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstateDto: UpdateEstateDto,
  ) {
    return this.estatesService.updateEstate(id, updateEstateDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Delete(':id')
  public remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.estatesService.deleteEstate(id);
  }
}
