import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CasesService } from './cases.service';
import { CreateCaseDto, AssignSellerDto } from './dto/case.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../common/roles.decorator';

@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post()
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  create(@Req() req: { user: { sub: string } }, @Body() dto: CreateCaseDto) {
    return this.casesService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: { user: { sub: string; role: UserRole } }) {
    return this.casesService.findAll(req.user.sub, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: { sub: string; role: UserRole } }) {
    return this.casesService.findOne(id, req.user.sub, req.user.role);
  }

  @Post(':id/submit')
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  submit(@Param('id') id: string, @Req() req: { user: { sub: string; role: UserRole } }) {
    return this.casesService.submit(id, req.user.sub, req.user.role);
  }

  @Post(':id/send-to-bank')
  @Roles(UserRole.ADMIN)
  sendToBank(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.casesService.sendToBank(id, req.user.sub);
  }

  @Post(':id/assign-seller')
  @Roles(UserRole.ADMIN)
  assignSeller(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
    @Body() dto: AssignSellerDto,
  ) {
    return this.casesService.assignSeller(id, req.user.sub, dto);
  }

  @Post(':id/request-appraisal')
  @Roles(UserRole.ADMIN)
  requestAppraisal(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.casesService.requestAppraisal(id, req.user.sub);
  }

  @Post(':id/complete-deal')
  @Roles(UserRole.ADMIN)
  completeDeal(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.casesService.completeDeal(id, req.user.sub);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Req() req: { user: { sub: string; role: UserRole } }) {
    return this.casesService.cancel(id, req.user.sub, req.user.role);
  }
}
