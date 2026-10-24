import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentDetailsService } from './providers/payment-details.service';
import { CreatePaymentDetailDto } from './dtos/createPaymentDetail.dto';
import { UpdatePaymentDetailDto } from './dtos/updatePaymentDetail.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('payment-details')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentDetailsController {
  constructor(private readonly paymentDetailsService: PaymentDetailsService) {}

  @Roles(Role.ADMIN)
  @Post()
  public create(@Body() createDto: CreatePaymentDetailDto) {
    return this.paymentDetailsService.create(createDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findAll() {
    return this.paymentDetailsService.findAll();
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('employee/:employeeId')
  public findByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ) {
    return this.paymentDetailsService.findByEmployeeId(employeeId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePaymentDetailDto,
  ) {
    return this.paymentDetailsService.update(id, updateDto);
  }
}
