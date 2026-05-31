import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBlogPostDto {
  @ApiProperty()
  @IsString()
  @Length(3, 150)
  title: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and hyphen-separated',
  })
  slug: string;

  @ApiProperty()
  @IsString()
  @Length(10, 500)
  summary: string;

  @ApiProperty()
  @IsString()
  @Length(50, 100000)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  publishedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 70)
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(10, 160)
  seoDescription?: string;

  @ApiPropertyOptional({ type: [String], description: 'Array of tag IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
