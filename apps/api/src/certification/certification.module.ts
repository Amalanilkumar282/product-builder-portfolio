import { Module } from '@nestjs/common';
import { CertificationAdminController } from './certification-admin.controller';
import { CertificationPublicController } from './certification-public.controller';
import { CertificationService } from './certification.service';

@Module({
  controllers: [CertificationPublicController, CertificationAdminController],
  providers: [CertificationService],
})
export class CertificationModule {}
