import { Controller, Get } from '@nestjs/common';
import { CertificationService } from './certification.service';

@Controller('certifications')
export class CertificationPublicController {
  constructor(private readonly certificationService: CertificationService) {}

  @Get()
  findAll() {
    return this.certificationService.findPublished();
  }
}
