import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Prisma } from '@prisma/client';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post('authentication')
  updateConfig(@Body() dto: Prisma.ConfigCreateInput) {
    return this.configService.updateConfig(dto);
  }
}
