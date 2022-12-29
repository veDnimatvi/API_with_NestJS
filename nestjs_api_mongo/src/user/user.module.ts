import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { AuthController } from './controller/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    // JwtModule.register({
    //   secret: 'at_secret',
    //   signOptions: {
    //     expiresIn: '1d', // 1d, 20h, 60
    //   },
    // }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, JwtStrategy],
})
export class UserModule {}
