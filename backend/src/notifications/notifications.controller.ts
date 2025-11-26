import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthGuard('jwt')) // Todo aquí es protegido
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications (Ver mis notificaciones)
  @Get()
  async findMine(@Request() req) {
    return this.notificationsService.findMyNotifications(req.user.id);
  }

  // GET /notifications/unread-count (Para la burbuja roja de la UI)
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  // PATCH /notifications/:id/read (Marcar una como leída)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}