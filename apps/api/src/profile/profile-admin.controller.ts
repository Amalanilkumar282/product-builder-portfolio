import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('admin/profile')
@ApiBearerAuth()
@Controller('admin/profile')
@UseGuards(JwtAuthGuard)
export class ProfileAdminController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findOne() {
    return this.profileService.findForAdmin();
  }

  @Patch()
  upsert(@Body() dto: UpdateProfileDto) {
    return this.profileService.upsert(dto);
  }
}
