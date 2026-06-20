import { Controller, Get } from '@nestjs/common';
import { TalkService } from './talk.service';

@Controller('talks')
export class TalkPublicController {
  constructor(private readonly talkService: TalkService) {}

  @Get()
  findAll() {
    return this.talkService.findPublished();
  }
}
