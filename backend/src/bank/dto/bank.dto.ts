import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BankCheckResult } from '@prisma/client';

export class ReviewCreditCheckDto {
  @IsEnum(BankCheckResult)
  result: BankCheckResult;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLoanAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
