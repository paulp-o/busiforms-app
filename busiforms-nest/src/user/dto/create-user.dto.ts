import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  accountProvider?: string;

  @IsString()
  @IsOptional()
  role?: string;
}
