import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginDto } from '../dto';
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(userDto: CreateUserDto) {
    userDto.password = await bcrypt.hash(userDto.password, 10);

    const userInDb = await this.userRepository.findUserByEmail({
      email: userDto.email,
    });

    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.create(userDto);
  }

  async findByLogin({ email, password }: LoginDto) {
    const user = await this.userRepository.findUserByEmail({
      email: email,
    });

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
    const result = (await this.userRepository.findAll()).map((item: any) => {
      return {
        id: item?._id,
        name: item?.name,
        email: item?.email,
        number: item?.number,
      };
    });

    return result;
  }

  async deleteUserById(id: any) {
    return await this.userRepository.deleteOne(id);
  }

  async updateUser(id: any, body: any) {
    return await this.userRepository.findByIdAndUpdate(id, body);
  }
}
