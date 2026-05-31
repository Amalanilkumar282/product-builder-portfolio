import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfilePublicController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  find() {
    return this.profileService.findPublished();
  }
}
