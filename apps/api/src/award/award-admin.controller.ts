import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AwardService } from './award.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';

@ApiTags('admin/awards')
@ApiBearerAuth()
@Controller('admin/awards')
@UseGuards(JwtAuthGuard)
export class AwardAdminController {
  constructor(private readonly awardService: AwardService) {}

  @Post()
  create(@Body() dto: CreateAwardDto) {
    return this.awardService.create(dto);
  }

  @Get()
  findAll() {
    return this.awardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAwardDto) {
    return this.awardService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awardService.remove(id);
  }
}
