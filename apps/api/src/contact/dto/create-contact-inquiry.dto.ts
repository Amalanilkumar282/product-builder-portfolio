import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactInquiryDto {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @ApiProperty()
  @IsString()
  @Length(3, 150)
  subject: string;

  @ApiProperty()
  @IsString()
  @Length(10, 5000)
  message: string;
}
