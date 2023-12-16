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
      return this.configFile;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve authentication data',
      );
    }
  }

  async updateConfig(data: Prisma.ConfigCreateInput) {
    try {
      return await this.databaseService.config.upsert({
        where: { id: 1 },
        create: data,
        update: data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update authentication data',
        error.message,
      );
    }
  }
}
