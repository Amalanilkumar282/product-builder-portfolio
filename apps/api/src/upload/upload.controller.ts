import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';

// Import validation decorators
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

// Define an enum for allowed entity types
enum EntityTypeEnum {
  profile = 'profile',
  project = 'project',
}

// DTO for the upload request body
class UploadRequestDto {
  @IsEnum(EntityTypeEnum, { message: 'Invalid entity type. Must be "profile" or "project".' })
  @IsNotEmpty()
  entityType: EntityTypeEnum;

  @IsString()
  @IsNotEmpty()
  entityId: string;
}

@ApiTags('admin/upload')
@ApiBearerAuth()
@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file and associate it with a profile or project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload with entity details',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        entityType: {
          type: 'string',
          enum: ['profile', 'project'],
          description: 'The type of entity to associate the upload with (profile or project).',
          example: 'profile',
        },
        entityId: {
          type: 'string',
          description: 'The ID of the entity (e.g., userId for profile, projectId for project).',
          example: 'user123', // Replace with actual example ID
        },
      },
      required: ['file', 'entityType', 'entityId'],
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadRequestDto: UploadRequestDto,
  ): Promise<{ url: string }> { // Return only the URL
    const { entityType, entityId } = uploadRequestDto;
    const imageUrl = await this.uploadService.upload(file, entityType, entityId);
    return { url: imageUrl };
  }

  // Keeping existing findAll and remove methods for Media, renamed to avoid conflict
  @Get('media') // Changed path to /admin/upload/media
  @ApiOperation({ summary: 'List all uploaded media files' })
  findAllMedia() {
    return this.uploadService.findAllMedia();
  }

  @Delete('media/:id') // Changed path to /admin/upload/media/:id
  @ApiOperation({ summary: 'Delete a media file by ID' })
  removeMedia(@Param('id') id: string) {
    return this.uploadService.removeMedia(id);
  }
}
