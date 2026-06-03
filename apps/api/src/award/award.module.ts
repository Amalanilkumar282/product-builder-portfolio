import { Module } from '@nestjs/common';
import { AwardService } from './award.service';
import { AwardAdminController } from './award-admin.controller';
import { AwardPublicController } from './award-public.controller';

@Module({
  controllers: [AwardPublicController, AwardAdminController],
  providers: [AwardService],
})
export class AwardModule {}
