import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { GatewayModule } from 'src/app/gateway/gateway.module';

@Module({
  imports: [ConfigModule, GatewayModule],
  providers: [ParserService, ConfigService],
  exports: [ParserService],
})
export class ParserModule {}
