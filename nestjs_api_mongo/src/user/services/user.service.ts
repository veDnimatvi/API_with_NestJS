import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginDto } from '../dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(userDto: CreateUserDto) {
    userDto.password = await bcrypt.hash(userDto.password, 10);

    const userInDb = await this.userModel
      .findOne({
        email: userDto.email,
      })
      .exec();

    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.userModel.create(userDto);
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

  async getAllUser() {
    const result = (await this.userModel.find()).map((item: any) => {
      return {
        id: item?._id,
        name: item?.name,
        email: item?.email,
        number: item?.number,
      };
    });

    const total = await this.userModel.countDocuments();

    return { data: result, total };
  }

  async deleteUserById(id: any) {
    return await this.userModel.deleteOne(id);
  }

  async updateUser(id: any, body: any) {
    return await this.userModel.findByIdAndUpdate(id, body);
  }
}
