import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginDto } from '../dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { ROLE } from 'src/utils/role';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  limit = 10;

  isValidEmail(email: string) {
    if (email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false;
  }

  async create(userDto: CreateUserDto) {
    if (!ROLE.includes(userDto.role)) {
      throw new HttpException('ROLE_INVALID', HttpStatus.BAD_REQUEST);
    } else {
      if (this.isValidEmail(userDto.email) && userDto.password) {
        const userInDb = await this.userModel
          .findOne({
            email: userDto.email,
          })
          .exec();

        if (!userInDb) {
          userDto.password = await bcrypt.hash(userDto.password, 10);
          return await this.userModel.create(userDto);
        } else {
          throw new HttpException(
            'USER_ALREADY_EXISTS',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'EMAIL_REGISTER_INVALID',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findByLogin({ email, password }: LoginDto) {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const compare_pass = bcrypt.compareSync(password, user.password);

    if (!compare_pass) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async getAllUser(page: number) {
    if (page < 1) {
      throw new HttpException('PAGE_NOT_FOUND', HttpStatus.BAD_REQUEST);
    } else {
      const result = (
        await this.userModel
          .find()
          .limit(this.limit)
          .skip(this.limit * (page - 1))
      ).map((item: any) => {
        return {
          id: item?._id,
          name: item?.name,
          email: item?.email,
          number: item?.number,
        };
      });

      const total = await this.userModel.countDocuments();
      return { data: result, page: Number(page), limit: this.limit, total };
    }
  }

  async deleteUserById(id: any) {
    return await this.userModel.deleteOne(id);
  }

  async updateUser(id: any, body: any) {
    return await this.userModel.findByIdAndUpdate(id, body);
  }
}
