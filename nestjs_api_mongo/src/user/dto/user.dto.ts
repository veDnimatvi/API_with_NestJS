import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() name: string;
  @IsNotEmpty() password: string;
  number: string;
}

export class LoginDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() password: string;
}
