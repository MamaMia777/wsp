import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers() {
    return this.databaseService.user.findMany({
      select: {
        email: true,
        role: true,
      },
    });
  }
  async createUser(dto: createUserDto) {
    return this.databaseService.user.create({
      data: {
        email: dto.email,
        role: dto.role,
      },
    });
  }
  async deleteUser(email: string) {
    return this.databaseService.user.delete({
      where: {
        email,
      },
    });
  }
  async updateUser(dto: createUserDto) {
    return this.databaseService.user.update({
      where: {
        email: dto.email,
      },
      data: {
        role: dto.role,
      },
    });
  }
}
