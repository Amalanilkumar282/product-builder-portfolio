import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { PublicProjectController } from './public-project.controller';
import { ProjectController } from './project.controller';

@Module({
  controllers: [PublicProjectController, ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
