import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactPublicController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Throttle({ strict: { ttl: 60_000, limit: 5 } })
  create(@Body() dto: CreateContactInquiryDto) {
    return this.contactService.create(dto);
  }
}
