import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto, ResetPassword, SendCode } from '../dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('email/verify/:token')
  verifyAccount(@Param() params) {
    return this.authService.verifyAccount(params.token);
  }

  @Post('send-code-reset')
  sendCodeResetPassword(@Body() body: SendCode) {
    return this.authService.sendCodeResetPassword(body);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPassword) {
    return this.authService.resetPassword(body);
  }
}
