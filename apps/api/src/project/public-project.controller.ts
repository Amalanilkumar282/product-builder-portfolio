import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('projects')
export class PublicProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findPublished() {
    return this.projectService.findPublished();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const project = await this.projectService.findPublishedBySlug(slug);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
