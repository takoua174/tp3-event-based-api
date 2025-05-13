import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventEntity } from './entities/event.entity';
import { BaseService } from '../../common/services/base.service';
import { CV_EVENTS } from '../../common/constants/events.constants';
import { CvEventPayload } from '../cv/cv-event-payload';
import { Subject } from 'rxjs';
@Injectable()
export class EventService
  extends BaseService<EventEntity>
  implements OnModuleInit
{ 
  private eventSubject = new Subject<any>();
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
     console.log('Handling event:', payload);
    const event = await this.create({
      cvId: payload.cvId,
      userId: payload.userId,
      operation: payload.operation,
      details: payload.details,
    } as EventEntity);
   
    this.eventSubject.next(payload);
     console.log('Event created:', event);
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


  getEventSubject(): Subject<any> {
  return this.eventSubject;
}
  
}
