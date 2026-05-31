import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PageSectionService } from './page-section.service';
import { UpdatePageSectionDto } from './dto/update-page-section.dto';
import { PageSectionType } from '@prisma/client';

@ApiTags('admin/page-sections')
@ApiBearerAuth()
@Controller('admin/page-sections')
@UseGuards(JwtAuthGuard)
export class PageSectionAdminController {
  constructor(private readonly pageSectionService: PageSectionService) {}

  @Get()
  findAll() {
    return this.pageSectionService.findAll();
  }

  @Patch(':type')
  update(
    @Param('type') type: PageSectionType,
    @Body() dto: UpdatePageSectionDto,
  ) {
    return this.pageSectionService.update(type, dto);
  }
}
