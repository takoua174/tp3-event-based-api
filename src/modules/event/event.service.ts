import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventEntity } from './entities/event.entity';
import { BaseService } from '../../common/services/base.service';
import { CV_EVENTS } from '../../common/constants/events.constants';
import { CvEventPayload } from '../cv/cv-event-payload';
@Injectable()
export class EventService
  extends BaseService<EventEntity>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private eventEmitter: EventEmitter2,
  ) {
    super(eventRepository);
  }

  onModuleInit() {
    // Register event listeners
    this.eventEmitter.on(CV_EVENTS.CREATED, this.handleCvEvent.bind(this));
    this.eventEmitter.on(CV_EVENTS.UPDATED, this.handleCvEvent.bind(this));
    this.eventEmitter.on(CV_EVENTS.DELETED, this.handleCvEvent.bind(this));
  }

  @OnEvent([CV_EVENTS.CREATED, CV_EVENTS.UPDATED, CV_EVENTS.DELETED])
  async handleCvEvent(payload: CvEventPayload) {
    const event = await this.create({
      cvId: payload.cvId,
      userId: payload.userId,
      operation: payload.operation,
      details: payload.details,
    } as EventEntity);
  }

  async getEventsForCv(
    cvId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<EventEntity[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .where('event.cvId = :cvId', { cvId });
    if (!isAdmin) {
      query.andWhere('event.userId = :userId', { userId });
    }
    return query.getMany();
  }
}
