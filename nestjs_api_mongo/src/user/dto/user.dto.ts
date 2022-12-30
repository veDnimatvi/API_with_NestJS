import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() name: string;
  @IsNotEmpty() password: string;
  valid: boolean;
  number: string;
  codeReset: number | null;
}

export class LoginDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() password: string;
}

export class SendCode {
  @IsNotEmpty() email: string;
}
export class ResetPassword {
  @IsNotEmpty() email: string;
  @IsNotEmpty() code: number;
  @IsNotEmpty() password: number;
}
