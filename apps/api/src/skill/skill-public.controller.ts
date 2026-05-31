import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkillService } from './skill.service';

@ApiTags('skills')
@Controller('skills')
export class SkillPublicController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  findAll() {
    return this.skillService.findPublished();
  }
}
