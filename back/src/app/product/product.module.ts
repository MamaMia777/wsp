import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ParserModule } from 'src/parser/parser.module';
import { JwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [ParserModule, JwtModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
