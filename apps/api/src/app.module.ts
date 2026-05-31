import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { ProjectModule } from './project/project.module';
import { ProfileModule } from './profile/profile.module';
import { SkillModule } from './skill/skill.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { TagModule } from './tag/tag.module';
import { BlogModule } from './blog/blog.module';
import { ContactModule } from './contact/contact.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import { PageSectionModule } from './page-section/page-section.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { HealthModule } from './health/health.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
      },
      {
        name: 'strict',
        ttl: 60_000,
        limit: 5,
      },
    ]),
    PrismaModule,
    AdminModule,
    AuthModule,
    ServiceModule,
    ProjectModule,
    ProfileModule,
    SkillModule,
    ExperienceModule,
    EducationModule,
    TestimonialModule,
    TagModule,
    BlogModule,
    ContactModule,
    TechStackModule,
    PageSectionModule,
    UploadModule,
    SearchModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
