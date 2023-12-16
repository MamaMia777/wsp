import { Body, Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Post()
  createUser(@Body() dto: createUserDto) {
    return this.userService.createUser(dto);
  }
  @Patch()
  updateUser(@Body() dto: createUserDto) {
    return this.userService.updateUser(dto);
  }
  @Delete()
  deleteUser(@Body() dto: { email: string }) {
    return this.userService.deleteUser(dto.email);
  }
}
