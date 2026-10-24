import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './providers/attendance.service';
import {
  CheckInAttendanceDto,
  CheckOutAttendanceDto,
} from './dtos/attendance.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('attendance')
@UseGuards(AuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Post('check-in')
  public checkIn(@Body() dto: CheckInAttendanceDto) {
    return this.attendanceService.checkIn(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Patch(':id/check-out')
  public checkOut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CheckOutAttendanceDto,
  ) {
    return this.attendanceService.checkOut(id, dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.SUPERVISOR)
  @Get()
  public findAll(
    @Query('workerId') workerId?: string,
    @Query('estateId') estateId?: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findAll({ workerId, estateId, date });
  }
}
