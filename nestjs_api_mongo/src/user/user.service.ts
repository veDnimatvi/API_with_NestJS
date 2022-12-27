import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async getAllUser() {
    return await this.userRepository.findAll();
  }

  async createNew(body: any) {
    return await this.userRepository.create(body);
  }

  async deleteUserById(id: any) {
    return await this.userRepository.deleteOne(id);
  }

  async updateUser(id: any, body: any) {
    return await this.userRepository.findByIdAndUpdate(id, body);
  }
}
