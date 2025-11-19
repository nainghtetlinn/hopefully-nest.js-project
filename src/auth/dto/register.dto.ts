import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    default: 'test1@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'user123',
  })
  @IsNotEmpty()
  @MinLength(6)
  username: string;

  @ApiProperty({
    default: 'user123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
