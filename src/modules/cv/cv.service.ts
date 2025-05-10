import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CvEntity } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { BaseService } from '../../common/services/base.service';
import { CV_EVENTS } from '../../common/constants/events.constants';
import { CvEventPayload } from './cv-event-payload';
import { UpdateCvDto } from './dto/update-cv.dto';
@Injectable()
export class CvService extends BaseService<CvEntity> {
  constructor(
    @InjectRepository(CvEntity)
    private cvRepository: Repository<CvEntity>,
    //private mailService: MailService,
    private eventEmitter: EventEmitter2,
  ) {
    super(cvRepository);
  }

  async createCv(dto: CreateCvDto, userId: string): Promise<CvEntity> {
    const cv = await this.create({ ...dto, userId } as CvEntity);
    const payload: CvEventPayload = {
      cvId: cv.id,
      userId,
      operation: 'CREATE',
      details: { name: dto.name, content: dto.job },
    };
    this.eventEmitter.emit(CV_EVENTS.CREATED, payload);
    //await this.mailService.sendCvAddedEmail('admin@example.com', cv);
    return cv;
  }
  async updateCv(id: string, dto: UpdateCvDto): Promise<CvEntity> {
    const cv = await this.update(id, dto as CvEntity);
    const payload: CvEventPayload = {
      cvId: cv.id,
      userId: dto.userId,
      operation: 'UPDATE',
      details: { name: dto.name, content: dto.job },
    };
    this.eventEmitter.emit(CV_EVENTS.UPDATED, payload);
    return cv;
  }
  async deleteCv(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.delete(id);
    const payload: CvEventPayload = {
      cvId: id,
      userId,
      operation: 'DELETE',
      details: { name: 'aleh fasakhtni :(' },
    };
    this.eventEmitter.emit(CV_EVENTS.DELETED, payload);
    return { success: true, message: 'CV deleted successfully' };
  }
  async findByUserId(userId: string): Promise<CvEntity[]> {
    return this.cvRepository.find({ where: { userId } });
  }
}
