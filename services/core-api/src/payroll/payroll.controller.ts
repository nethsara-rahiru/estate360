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
import { PayrollService } from './providers/payroll.service';
import { CreatePayRateDto } from './dtos/create-pay-rate.dto';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('payroll')
@UseGuards(AuthGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // Pay Rates
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('rates')
  public createPayRate(@Body() dto: CreatePayRateDto) {
    return this.payrollService.createPayRate(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('rates/estate/:estateId')
  public findRatesByEstate(@Param('estateId', ParseUUIDPipe) estateId: string) {
    return this.payrollService.findPayRatesByEstate(estateId);
  }

  // Payroll
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('generate')
  public generatePayroll(@Body() dto: GeneratePayrollDto) {
    return this.payrollService.generatePayroll(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findPayrolls(@Query('ownerId') ownerId?: string) {
    return this.payrollService.findPayrolls(ownerId);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get(':id')
  public findPayrollById(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.findPayrollById(id);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Patch(':id/process')
  public processPayroll(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.processPayroll(id);
  }

  // Payments
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('payments')
  public createPayment(@Body() dto: CreatePaymentDto) {
    return this.payrollService.createPayment(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('payments/all')
  public findPayments() {
    return this.payrollService.findPayments();
  }
}
