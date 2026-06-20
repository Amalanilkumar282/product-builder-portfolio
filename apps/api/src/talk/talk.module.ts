import { Module } from '@nestjs/common';
import { TalkAdminController } from './talk-admin.controller';
import { TalkPublicController } from './talk-public.controller';
import { TalkService } from './talk.service';

@Module({
  controllers: [TalkPublicController, TalkAdminController],
  providers: [TalkService],
})
export class TalkModule {}
