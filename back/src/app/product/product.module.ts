import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ParserModule } from 'src/parser/parser.module';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [ParserModule, GatewayModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
