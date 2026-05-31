import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';

@ApiTags('blog')
@Controller('blog')
export class BlogPublicController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() {
    return this.blogService.findPublished();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.blogService.findPublishedBySlug(slug);
  }
}
