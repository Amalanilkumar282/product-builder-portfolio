import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceAdminController } from './experience-admin.controller';
import { ExperiencePublicController } from './experience-public.controller';

@Module({
  controllers: [ExperiencePublicController, ExperienceAdminController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
