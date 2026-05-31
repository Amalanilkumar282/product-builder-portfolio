import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and hyphen-separated',
  })
  slug: string;

  @IsString()
  @Length(10, 300)
  description: string;

  @IsString()
  @Length(20, 5000)
  content: string;

  @IsOptional()
  @IsString()
  @Length(3, 70)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @Length(10, 160)
  seoDescription?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Array of tag IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
