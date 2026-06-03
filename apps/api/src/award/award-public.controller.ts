import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AwardService } from './award.service';

@ApiTags('awards')
@Controller('awards')
export class AwardPublicController {
  constructor(private readonly awardService: AwardService) {}

  @Get()
  findAll() {
    return this.awardService.findPublished();
  }
}
