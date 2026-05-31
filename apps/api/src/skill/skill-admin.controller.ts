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
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@ApiTags('admin/skills')
@ApiBearerAuth()
@Controller('admin/skills')
@UseGuards(JwtAuthGuard)
export class SkillAdminController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.skillService.create(dto);
  }

  @Get()
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.skillService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
