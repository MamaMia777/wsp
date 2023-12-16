import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}
  async validateUser(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async findUser(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
}
