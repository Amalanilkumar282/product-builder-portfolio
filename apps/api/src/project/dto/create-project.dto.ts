import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsUrl,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsString()
  @Length(3, 120)
  title: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and hyphen-separated',
  })
  slug: string;

  @IsString()
  @Length(10, 300)
  summary: string;

  @IsString()
  @Length(50, 10000)
  content: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  @Length(2, 120)
  role?: string;

  @IsOptional()
  @IsString()
  @Length(2, 150)
  clientName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  duration?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  status?: string;

  @IsOptional()
  @IsString()
  @Length(2, 120)
  industry?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10000)
  challenge?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10000)
  approach?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10000)
  outcome?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  metrics?: string;

  @IsOptional()
  @IsString()
  @Length(2, 500)
  stackSummary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedServiceSlugs?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

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
