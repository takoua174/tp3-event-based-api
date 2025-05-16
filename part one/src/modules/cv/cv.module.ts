import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvEntity } from './entities/cv.entity';
import { EventService } from '../event/event.service';
import { EventModule } from '../event/event.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([CvEntity]),
EventModule,
JwtModule.register({
      secret: 'randomly-generated-secure-secret-12345', 
      signOptions: { expiresIn: '1h' },
    }),
],
  controllers: [CvController],
  providers: [CvService ,EventService],
})
export class CvModule {}
