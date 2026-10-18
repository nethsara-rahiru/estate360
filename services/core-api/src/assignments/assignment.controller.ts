import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEstateAssignmentDto } from './dtos/estate-assignment/createEstateAssignmentDto';
import { EstateAssignmentService } from './providers/estate-assignment.service';
import { UpdateEstateAssignmentDto } from './dtos/estate-assignment/updateEstateAssignmentDto';

@Controller('assignments')
export class AssignmentsController {
  constructor(
    @Inject() private readonly estateAssignmentService: EstateAssignmentService,
  ) {}

  @Post('/estate')
  public createEstateAssignment(
    @Body() createEstateAssignmentDto: CreateEstateAssignmentDto,
  ) {
    return this.estateAssignmentService.createAssignment(
      createEstateAssignmentDto,
    );
  }

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

  @Get('/estate')
  public getAllAssignments() {
    return this.estateAssignmentService.findAllAssignments();
  }

  @Get('/estate/:id')
  public getAssignmentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.estateAssignmentService.findAssignmentById(id);
  }
}
