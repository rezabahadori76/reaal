import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getAll(@Req() req: { user: { sub: string } }) {
    return this.notificationsService.getForUser(req.user.sub);
  }

  @Get('unread-count')
  unreadCount(@Req() req: { user: { sub: string } }) {
    return this.notificationsService.getUnreadCount(req.user.sub);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.notificationsService.markRead(id, req.user.sub);
  }

  @Patch('read-all')
  markAllRead(@Req() req: { user: { sub: string } }) {
    return this.notificationsService.markAllRead(req.user.sub);
  }
}
