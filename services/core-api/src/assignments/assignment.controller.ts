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
import { CreateEstateAssignmentDto } from './dtos/estate-assignment/createEstateAssignmentDto';
import { EstateAssignmentService } from './providers/estate-assignment.service';
import { UpdateEstateAssignmentDto } from './dtos/estate-assignment/updateEstateAssignmentDto';
import { CreateWorkerAssignmentDto } from './dtos/worker-assignment/createWorkerAssignmentDto';
import { UpdateWorkerAssignmentDto } from './dtos/worker-assignment/updateWorkerAssignmentDto';
import { WorkerAssignmentService } from './providers/worker-assignment.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role as AuthRole } from 'src/auth/enums/role.enum';

@Controller('assignments')
@UseGuards(AuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(
    private readonly estateAssignmentService: EstateAssignmentService,
    private readonly workerAssignmentService: WorkerAssignmentService,
  ) {}

  //Estate
  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Post('/estate')
  public createEstateAssignment(
    @Body() createEstateAssignmentDto: CreateEstateAssignmentDto,
  ) {
    return this.estateAssignmentService.createAssignment(
      createEstateAssignmentDto,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Patch('/estate/:id')
  public updateEstateAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstateAssignmentDto: UpdateEstateAssignmentDto,
  ) {
    return this.estateAssignmentService.updateAssignment(
      id,
      updateEstateAssignmentDto,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/estate')
  public getAllEstateAssignments() {
    return this.estateAssignmentService.findAllAssignments();
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/estate/:id')
  public getEstateAssignmentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.estateAssignmentService.findAssignmentById(id);
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Delete('/estate/:id')
  public deleteEstateAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.estateAssignmentService.removeAssignment(id);
  }

  //Worker
  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Post('/worker')
  public createWorkerAssignment(
    @Body() createWorkerAssignmentDto: CreateWorkerAssignmentDto,
  ) {
    return this.workerAssignmentService.createAssignment(
      createWorkerAssignmentDto,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Patch('/worker/:id')
  public updateWorkerAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkerAssignmentDto: UpdateWorkerAssignmentDto,
  ) {
    return this.workerAssignmentService.updateAssignment(
      id,
      updateWorkerAssignmentDto,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/worker')
  public getAllWorkerAssignments() {
    return this.workerAssignmentService.findAllAssignments();
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/worker/:id')
  public getWorkerAssignmentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.workerAssignmentService.findAssignmentById(id);
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Delete('/worker/:id')
  public deleteWorkerAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.workerAssignmentService.deleteAssignment(id);
  }
}
