import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TechStackService } from './tech-stack.service';

@ApiTags('tech-stack')
@Controller('tech-stack')
export class TechStackPublicController {
  constructor(private readonly techStackService: TechStackService) {}

  @Get()
  findAll() {
    return this.techStackService.findPublished();
  }
}
