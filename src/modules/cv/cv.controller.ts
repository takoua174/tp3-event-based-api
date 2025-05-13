import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
  Sse,
  Req
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Roles } from '../auth/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';
import { EventService } from '../event/event.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('cvs')
@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService, private readonly eventService: EventService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCv(@Body() dto: CreateCvDto, @Request() req) {
    return await this.cvService.createCv(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll/user')
  async findAlluser(@Request() req) {
    return this.cvService.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-one/:id')
  async findOne(@Param('id') id: number, @Request() req) {
    console.log('req.user.role', req.user.role);
    if (req.user.role == Roles.Admin) {
      return this.cvService.findOne(id);
    } else {
      throw new UnauthorizedException(
        'Unauthorized access: Only admins can perform this action.',
      );
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async findall(@Param('id') id: number, @Request() req) {
    if (req.user.role == Roles.Admin) {
      return this.cvService.findAll();
    } else {
      throw new UnauthorizedException(
        'Unauthorized access: Only admins can perform this action.',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCvDto,
    @Request() req,
  ) {
    return await this.cvService.updateCv(id, dto , req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req) {
    return await this.cvService.deleteCv(id, req.user.userId);
  }

  @Sse('events')
  cvEvents(@Request() request): Observable<any> {
     console.log('SSE connection established');
    const token = request.query.token?.toString();

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decoded.sub;
    const userRole = decoded.role;
    return this.eventService.getEventSubject().asObservable().pipe(
      filter((event) => {
      // Filter events for admin or the specific user
      const shouldStream = userRole === 'admin' || event.userId === userId;
      console.log('Filter check:', { userRole, userId, eventUserId: event.userId, shouldStream });
      return shouldStream;
    }),
    map((event) => {
      // Log the event being streamed
      console.log('Streaming event to client:', event);
      // Return the event in SSE format
      return { data: event };
    }),
    )
  }
}
