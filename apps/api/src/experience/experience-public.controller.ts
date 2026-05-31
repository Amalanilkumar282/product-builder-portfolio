import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';

@ApiTags('experience')
@Controller('experience')
export class ExperiencePublicController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  findAll() {
    return this.experienceService.findPublished();
  }
}
