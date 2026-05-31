import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationAdminController } from './education-admin.controller';
import { EducationPublicController } from './education-public.controller';

@Module({
  controllers: [EducationPublicController, EducationAdminController],
  providers: [EducationService],
})
export class EducationModule {}
