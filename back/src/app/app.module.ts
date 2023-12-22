import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ParserModule } from '../parser/parser.module';
import { ParserService } from '../parser/parser.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './users/user.module';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    ConfigModule,
    ParserModule,
    ProductModule,
    UserModule,
    AuthModule,
    JwtModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, ParserService, JwtService],
})
export class AppModule {}
