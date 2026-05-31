import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileAdminController } from './profile-admin.controller';
import { ProfilePublicController } from './profile-public.controller';

@Module({
  controllers: [ProfilePublicController, ProfileAdminController],
  providers: [ProfileService],
})
export class ProfileModule {}
