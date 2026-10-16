import { Body, Controller, Inject, Post } from '@nestjs/common';
import { createEstateAssignmentDto } from './dtos/estate-assignment/createEstateAssignmentDto';
import { EstateAssignmentService } from './providers/estate-assignment.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(
    @Inject() private readonly estateAssignmentService: EstateAssignmentService,
  ) {}

  @Post('/estate')
  public createEstateAssignment(
    @Body() createEstateAssignmentDto: createEstateAssignmentDto,
  ) {
    return this.estateAssignmentService.create(createEstateAssignmentDto);
  }
}
