import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestimonialService } from './testimonial.service';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialPublicController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Get()
  findAll() {
    return this.testimonialService.findPublished();
  }
}
