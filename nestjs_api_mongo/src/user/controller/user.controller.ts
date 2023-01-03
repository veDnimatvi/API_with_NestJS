import {
  Controller,
  Get,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard())
  @Get()
  getAllUser(@Query('page') page: number) {
    return this.userService.getAllUser(page);
  }

  @UseGuards(AuthGuard())
  @Delete(':id') // http://localhost:3000/user/id
  async deleteUserById(@Param('id') id: any) {
    await this.userService.deleteUserById(id);
    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  async updateUser(@Param('id') id: any, @Body() body: any) {
    await this.userService.updateUser(id, body);
    return {
      updated: true,
    };
  }
}
