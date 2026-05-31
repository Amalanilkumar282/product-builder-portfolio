import { Module } from '@nestjs/common';
import { PageSectionService } from './page-section.service';
import { PageSectionAdminController } from './page-section-admin.controller';
import { PageSectionPublicController } from './page-section-public.controller';

@Module({
  controllers: [PageSectionPublicController, PageSectionAdminController],
  providers: [PageSectionService],
})
export class PageSectionModule {}
