import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto, ResetPassword, SendCode } from '../dto';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(userDto: CreateUserDto) {
    const token = await this._createToken(userDto);
    // cach lay user va pass co trong phan blog https://websitecuathien.vercel.app/vitamins/spring-boot-mail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: '587',
      service: false,
      auth: {
        user: this.configService.get('MAIL_ADMIN'),
        pass: this.configService.get('PASS_MAIL_ADMIN'),
      },
    });

    const mailOptions = {
      from: '"Company" <' + this.configService.get('MAIL_ADMIN') + '>',
      to: userDto.email, // list of receivers (separated by ,)
      subject: 'Verify Email',
      text: 'Verify Email',
      html:
        'Hi! <br><br> Thanks for your registration<br><br>' +
        '<a href=' +
        this.configService.get('BASE_URL') +
        '/auth/email/verify/' +
        token.accessToken +
        '>Click here to activate your account</a>', // html body
    };

    // co the redirect ve man /auth/email/verify/:token call api /auth/email/verify/:token sau khi tra ve verify true thi redirect ve man login

    const sent = await new Promise<boolean>(async function (resolve, reject) {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Message sent: %s', error);
          return reject(false);
        }
        console.log('Message sent: %s', info.messageId);
        resolve(true);
      });
    });
    if (sent) {
      await this.userService.create({
        ...userDto,
        valid: false,
        codeReset: null,
      });
      return {
        resgisted: true,
        message: 'Please check your email for verify',
      };
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendCodeResetPassword(body: SendCode) {
    const generateNumber = Math.floor(Math.random() * 9000000) + 1000000;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: '587',
      service: false,
      auth: {
        user: this.configService.get('MAIL_ADMIN'),
        pass: this.configService.get('PASS_MAIL_ADMIN'),
      },
    });

    const mailOptions = {
      from: '"Company" <' + this.configService.get('MAIL_ADMIN') + '>',
      to: body.email, // list of receivers (separated by ,)
      subject: 'Reset Password Email',
      text: 'Reset Password Email',
      html:
        'Hi! <br><br> Forgot your password?<br>We received a request to reset the password for your account.<br> Code reset is: <br><b>' +
        generateNumber +
        '</b><br>', // html body
    };

    const sent = await new Promise<boolean>(async function (resolve, reject) {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Message sent: %s', error);
          return reject(false);
        }
        console.log('Message sent: %s', info.messageId);
        resolve(true);
      });
    });

    if (sent) {
      const user = await this.userModel.findOne({ email: body.email }).exec();

      user.codeReset = generateNumber;
      user.save();

      return {
        send: true,
      };
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(body: ResetPassword) {
    const user = await this.userModel.findOne({ email: body.email }).exec();

    if (user.codeReset === body.code) {
      user.password = await bcrypt.hash(body.password, 10);
      user.codeReset = null;
      user.save();
      return {
        updated: true,
      };
    } else {
      throw new HttpException(
        'CODE NOT CORRECT, PLEASE TRY AGAIN!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyAccount(token: string) {
    const info = JSON.parse(JSON.stringify(this.jwtService.decode(token)));

    const user = await this.userModel.findOne({ email: info.email });

    if (user) {
      user.valid = true;
      user.save();

      return {
        verify: true,
      };
    } else {
      throw new HttpException('EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByLogin(loginDto);
    // const token = await this._createToken(user);
    // console.log('decode', token, this.jwtService.decode(token.accessToken));

    if (user.valid) {
      const token = this._createToken(user);
      return {
        email: user.email,
        name: user.name,
        ...token,
      };
    } else {
      throw new HttpException('UNVERIFIED ACCOUNT', HttpStatus.FORBIDDEN);
    }
  }

  private _createToken({ email }): any {
    const accessToken = this.jwtService.sign({ email });
    return {
      accessToken,
    };
  }
}
