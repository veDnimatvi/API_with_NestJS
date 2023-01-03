import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Optional } from 'sequelize';
import { CreateUserDto } from './dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(user: Optional<CreateUserDto, keyof CreateUserDto>) {
    await this.userModel.create(user);
    return { created: true };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
}
