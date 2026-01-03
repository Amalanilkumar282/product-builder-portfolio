import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
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
  description?: string;

  @IsOptional()
  @IsString()
  @Length(20, 5000)
  content?: string;

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