import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Alex Morgan' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: '+1 (555) 123-4567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: ['CUSTOMER', 'SHOP_OWNER'], default: 'CUSTOMER' })
  @IsOptional()
  @IsEnum(['CUSTOMER', 'SHOP_OWNER'])
  role?: string;
}
