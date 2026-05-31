import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageSectionService } from './page-section.service';

@ApiTags('page-sections')
@Controller('page-sections')
export class PageSectionPublicController {
  constructor(private readonly pageSectionService: PageSectionService) {}

  @Get()
  findEnabled() {
    return this.pageSectionService.findEnabled();
  }
}
