import { Controller, Post } from '@nestjs/common';

@Controller('assignments')
export class AssignmentsController {
  @Post('/estate')
  public createEstateAssignment() {}
}
