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
import { CreateOwnerDto } from './dtos/createOwnerDto';
import { PatchOwnerDto } from './dtos/patchOwnerDto';
import { OwnersService } from './providers/owners.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  public createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.createOwner(createOwnerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  public findAll() {
    return this.ownersService.findAllOwners();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  @Get('/:id')
  public findOne(@Param('id', ParseUUIDPipe) ownerId: string) {
    return this.ownersService.findOneOwner(ownerId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  @Patch('/:id')
  public patchOwner(
    @Param('id', ParseUUIDPipe) ownerId: string,
    @Body() patchOwnerDto: PatchOwnerDto,
  ) {
    return this.ownersService.updateOwner(ownerId, patchOwnerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  public deleteOwner(@Param('id', ParseUUIDPipe) ownerId: string) {
    return this.ownersService.deleteOwner(ownerId);
  }
}
