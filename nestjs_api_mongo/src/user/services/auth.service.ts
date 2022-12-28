import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from '../dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    const token = this._createToken(user);
    return {
      email: user.email,
      ...token,
    };
  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByLogin(loginDto);
    const token = this._createToken(user);
    return {
      email: user.email,
      ...token,
    };
  }

  private _createToken({ email }): any {
    const accessToken = this.jwtService.sign({ email });
    return {
      expiresIn: 259200,
      accessToken,
    };
  }
}
