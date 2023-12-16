import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ConfigService implements OnModuleInit {
  private configFile: Prisma.ConfigCreateInput;
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    this.configFile = await this.databaseService.config.findFirst();
    Logger.log('Config file loaded');
  }
  async getConfig() {
    try {
      return await this.databaseService.config.findFirst();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve authentication data',
      );
    }
  }

  async updateConfig(data: Prisma.ConfigCreateInput) {
    try {
      return await this.databaseService.config.update({
        where: { id: 1 },
        data: data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update authentication data',
        error.message,
      );
    }
  }
}
