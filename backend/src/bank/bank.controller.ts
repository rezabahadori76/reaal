import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { BankService } from './bank.service';
import { ReviewCreditCheckDto } from './dto/bank.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../common/roles.decorator';

@Controller('bank')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BankController {
  constructor(private bankService: BankService) {}

  @Get('pending')
  @Roles(UserRole.BANK_OPS, UserRole.ADMIN)
  getPending() {
    return this.bankService.getPendingReviews();
  }

  @Post('cases/:caseId/review')
  @Roles(UserRole.BANK_OPS, UserRole.ADMIN)
  review(
    @Param('caseId') caseId: string,
    @Req() req: { user: { sub: string } },
    @Body() dto: ReviewCreditCheckDto,
  ) {
    return this.bankService.reviewCreditCheck(caseId, req.user.sub, dto);
  }
}
