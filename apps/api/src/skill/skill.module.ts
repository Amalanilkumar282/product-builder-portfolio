import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillAdminController } from './skill-admin.controller';
import { SkillPublicController } from './skill-public.controller';

@Module({
  controllers: [SkillPublicController, SkillAdminController],
  providers: [SkillService],
})
export class SkillModule {}
