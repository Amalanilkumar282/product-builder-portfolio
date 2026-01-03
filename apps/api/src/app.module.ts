import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [PrismaModule, AdminModule, AuthModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
