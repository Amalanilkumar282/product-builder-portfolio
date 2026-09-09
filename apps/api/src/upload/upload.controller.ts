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
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { UPLOAD_TARGET_NAMES, type UploadTargetName } from './upload-targets';

class UploadRequestDto {
  @IsIn(UPLOAD_TARGET_NAMES, {
    message: `target must be one of: ${UPLOAD_TARGET_NAMES.join(', ')}`,
  })
  @IsNotEmpty()
  target: UploadTargetName;

  /**
   * Optional so the admin can upload a cover for a record that does not exist
   * yet: the form receives the URL back and includes it in the create payload.
   */
  @IsOptional()
  @IsString()
  entityId?: string;
}

@ApiTags('admin/upload')
@ApiBearerAuth()
@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({
    summary:
      'Upload an image or PDF to Cloudinary and optionally write its URL onto the owning record',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload with a destination target',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        target: {
          type: 'string',
          enum: UPLOAD_TARGET_NAMES,
          description:
            'Where the file belongs. Use unattached_image / unattached_document to receive a URL without writing to the database.',
          example: 'project_cover',
        },
        entityId: {
          type: 'string',
          description:
            'Id of the owning record. Required for every target except the unattached_* ones.',
        },
      },
      required: ['file', 'target'],
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadRequestDto,
  ): Promise<{ url: string; publicId: string }> {
    return this.uploadService.upload(file, dto.target, dto.entityId);
  }

  @Get('media')
  @ApiOperation({ summary: 'List all uploaded media files' })
  findAllMedia() {
    return this.uploadService.findAllMedia();
  }

  @Delete('media/:id')
  @ApiOperation({ summary: 'Delete a media file by ID' })
  removeMedia(@Param('id') id: string) {
    return this.uploadService.removeMedia(id);
  }
}
