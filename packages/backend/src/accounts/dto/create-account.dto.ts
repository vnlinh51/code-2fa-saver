import {
  IsString,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'GitHub' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'JBSWY3DPEHPK3PXP' })
  @IsString()
  @MinLength(16)
  @Matches(/^[A-Z2-7=]+$/i, { message: 'Secret phải là Base32 hợp lệ' })
  secret: string;

  @ApiPropertyOptional({ example: 'https://github.com' })
  @IsOptional()
  @IsUrl({}, { message: 'URL không hợp lệ' })
  url?: string;
}
