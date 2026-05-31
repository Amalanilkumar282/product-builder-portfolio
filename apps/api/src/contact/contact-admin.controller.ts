import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContactService } from './contact.service';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';

@ApiTags('admin/contact')
@ApiBearerAuth()
@Controller('admin/contact')
@UseGuards(JwtAuthGuard)
export class ContactAdminController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateContactStatusDto) {
    return this.contactService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
