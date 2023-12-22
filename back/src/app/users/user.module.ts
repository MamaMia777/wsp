import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
