import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ServiceService } from './service.service';

@Controller('services')
export class PublicServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async findPublished() {
    return this.serviceService.findPublished();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const service = await this.serviceService.findPublishedBySlug(slug);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }
}
