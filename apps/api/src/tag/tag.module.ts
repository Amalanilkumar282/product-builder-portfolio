import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagAdminController } from './tag-admin.controller';
import { TagPublicController } from './tag-public.controller';

@Module({
  controllers: [TagPublicController, TagAdminController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
