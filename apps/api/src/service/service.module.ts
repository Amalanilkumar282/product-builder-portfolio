import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { PublicServiceController } from './public-service.controller';
import { ServiceService } from './service.service';

@Module({
  controllers: [ServiceController, PublicServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
