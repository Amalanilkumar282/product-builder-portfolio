import {
  IsBoolean,
  IsEmail,
  IsJSON,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  shortName?: string;

  @ApiProperty()
  @IsString()
  @Length(2, 100)
  title: string;

  @ApiProperty()
  @IsString()
  @Length(10, 2000)
  bio: string;

  @ApiProperty()
  @IsString()
  @Length(5, 200)
  headline: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  alternateEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  whatsappUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 150)
  currentCompany?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 150)
  currentRole?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 150)
  alumniOf?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  socialLinks?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
