import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get('cv/:cvId/events')
  async getEventsForCv(
    @Param('cvId') cvId: string,
    @Request() req,
  ): Promise<any> {
    const user = req.user;
    const isAdmin = user.role === 'admin';
    return this.eventService.getEventsForCv(cvId, user.userId, isAdmin);
  }
}
