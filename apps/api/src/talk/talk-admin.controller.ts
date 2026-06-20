import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TalkService } from './talk.service';
import { CreateTalkDto } from './dto/create-talk.dto';
import { UpdateTalkDto } from './dto/update-talk.dto';

@ApiTags('admin/talks')
@ApiBearerAuth()
@Controller('admin/talks')
@UseGuards(JwtAuthGuard)
export class TalkAdminController {
  constructor(private readonly talkService: TalkService) {}

  @Post()
  create(@Body() dto: CreateTalkDto) {
    return this.talkService.create(dto);
  }

  @Get()
  findAll() {
    return this.talkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talkService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTalkDto) {
    return this.talkService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.talkService.remove(id);
  }
}
