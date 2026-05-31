import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialAdminController } from './testimonial-admin.controller';
import { TestimonialPublicController } from './testimonial-public.controller';

@Module({
  controllers: [TestimonialPublicController, TestimonialAdminController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
