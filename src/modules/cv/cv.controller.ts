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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Roles } from '../auth/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';

@ApiTags('cvs')
@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

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
    return await this.cvService.updateCv(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req) {
    return await this.cvService.deleteCv(id, req.user.userId);
  }
}
