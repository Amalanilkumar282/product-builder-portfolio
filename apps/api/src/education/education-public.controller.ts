import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EducationService } from './education.service';

@ApiTags('education')
@Controller('education')
export class EducationPublicController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  findAll() {
    return this.educationService.findPublished();
  }
}
