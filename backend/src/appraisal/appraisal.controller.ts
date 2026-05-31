import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AppraisalService } from './appraisal.service';
import { SubmitAppraisalDto } from './dto/appraisal.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../common/roles.decorator';

@Controller('appraisal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppraisalController {
  constructor(private appraisalService: AppraisalService) {}

  @Get('pending')
  @Roles(UserRole.APPRAISER, UserRole.ADMIN)
  getPending() {
    return this.appraisalService.getPendingRequests();
  }

  @Post('cases/:caseId/accept')
  @Roles(UserRole.APPRAISER, UserRole.ADMIN)
  accept(@Param('caseId') caseId: string, @Req() req: { user: { sub: string } }) {
    return this.appraisalService.acceptRequest(caseId, req.user.sub);
  }

  @Post('cases/:caseId/submit')
  @Roles(UserRole.APPRAISER, UserRole.ADMIN)
  submit(
    @Param('caseId') caseId: string,
    @Req() req: { user: { sub: string } },
    @Body() dto: SubmitAppraisalDto,
  ) {
    return this.appraisalService.submitReport(caseId, req.user.sub, dto);
  }
}
