import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
