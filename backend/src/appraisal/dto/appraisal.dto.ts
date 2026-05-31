import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SubmitAppraisalDto {
  @IsNumber()
  @Min(0)
  appraisedValue: number;

  @IsOptional()
  @IsString()
  reportNotes?: string;

  @IsOptional()
  @IsString()
  reportFileName?: string;
}
