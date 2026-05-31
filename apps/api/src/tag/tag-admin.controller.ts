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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('admin/tags')
@ApiBearerAuth()
@Controller('admin/tags')
@UseGuards(JwtAuthGuard)
export class TagAdminController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
