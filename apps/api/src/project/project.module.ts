import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { PublicProjectController } from './public-project.controller';

@Module({
  controllers: [PublicProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
