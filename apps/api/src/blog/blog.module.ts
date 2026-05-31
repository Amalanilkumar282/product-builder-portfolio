import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogAdminController } from './blog-admin.controller';
import { BlogPublicController } from './blog-public.controller';

@Module({
  controllers: [BlogPublicController, BlogAdminController],
  providers: [BlogService],
})
export class BlogModule {}
