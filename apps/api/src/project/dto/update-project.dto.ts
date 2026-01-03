import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsUrl,
} from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @Length(3, 120)
  title?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and hyphen-separated',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @Length(10, 300)
  summary?: string;

  @IsOptional()
  @IsString()
  @Length(50, 10000)
  content?: string;

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
  @Length(3, 70)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @Length(10, 160)
  seoDescription?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
