import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class GeneratePayrollDto {
  @IsUUID()
  @IsNotEmpty()
  ownerId!: string;

  @IsDateString()
  @IsNotEmpty()
  periodStart!: string;

  @IsDateString()
  @IsNotEmpty()
  periodEnd!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  paymentFrequency!: string;
}
