import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { OwnerStatus } from '../enums/owner-status.enum';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ValidateIf((o: CreateOwnerDto) => !o.contactEmail)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ValidateIf((o: CreateOwnerDto) => !o.email)
  @IsEmail()
  @IsNotEmpty()
  contactEmail?: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
    },
  )
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsPhoneNumber('LK')
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  address?: string;

  @IsOptional()
  @IsEnum(OwnerStatus)
  status?: OwnerStatus;
}
