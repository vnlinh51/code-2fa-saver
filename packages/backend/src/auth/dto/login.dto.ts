import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  username: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  password: string;
}
