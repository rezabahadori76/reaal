import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PropertySource } from '@prisma/client';

export class CreateCaseDto {
  @IsString()
  propertyAddress: string;

  @IsString()
  propertyType: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  propertyArea?: number;

  @IsOptional()
  @IsEnum(PropertySource)
  propertySource?: PropertySource;

  @IsOptional()
  @IsNumber()
  @Min(0)
  askingPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  buyerIncome?: number;

  @IsOptional()
  @IsString()
  buyerNotes?: string;
}

export class AssignSellerDto {
  @IsString()
  sellerId: string;
}

export class TransitionCaseDto {
  @IsString()
  toStatus: string;

  @IsOptional()
  @IsString()
  message?: string;
}
