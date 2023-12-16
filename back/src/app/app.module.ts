import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ParserModule } from '../parser/parser.module';
import { ParserService } from '../parser/parser.service';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    ConfigModule,
    ParserModule,
    ProductModule,
    AuthModule,
    GatewayModule,
    PassportModule.register({ session: true }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, ParserService],
})
export class AppModule {}
