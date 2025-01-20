import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  nickname?: string;

  @IsOptional()
  phone?: string;
}
