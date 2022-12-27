import {
  Controller,
  Get,
  Body,
  Post,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Post()
  createNew(@Body() body: any) {
    return this.userService.createNew(body);
  }

  @Delete(':id') // http://localhost:3000/user/id
  async deleteUserById(@Param('id') id: any) {
    await this.userService.deleteUserById(id);
    return {
      deleted: true,
    };
  }

  @Put(':id')
  async updateUser(@Param('id') id: any, @Body() body: any) {
    await this.userService.updateUser(id, body);
    return {
      updated: true,
    };
  }
}
