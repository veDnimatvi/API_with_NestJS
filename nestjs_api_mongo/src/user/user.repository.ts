import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { BaseRepository } from 'src/utils/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  findUserByEmail(email: any) {
    return this.userModel.findOne(email);
  }

  countDocument() {
    return this.userModel.countDocuments();
  }
}
