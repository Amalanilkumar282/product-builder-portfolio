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
import { TechStackService } from './tech-stack.service';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';

@ApiTags('admin/tech-stack')
@ApiBearerAuth()
@Controller('admin/tech-stack')
@UseGuards(JwtAuthGuard)
export class TechStackAdminController {
  constructor(private readonly techStackService: TechStackService) {}

  @Post()
  create(@Body() dto: CreateTechStackDto) {
    return this.techStackService.create(dto);
  }

  @Get()
  findAll() {
    return this.techStackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techStackService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTechStackDto) {
    return this.techStackService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techStackService.remove(id);
  }
}
