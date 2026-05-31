import { Module } from '@nestjs/common';
import { TechStackService } from './tech-stack.service';
import { TechStackAdminController } from './tech-stack-admin.controller';
import { TechStackPublicController } from './tech-stack-public.controller';

@Module({
  controllers: [TechStackPublicController, TechStackAdminController],
  providers: [TechStackService],
})
export class TechStackModule {}
