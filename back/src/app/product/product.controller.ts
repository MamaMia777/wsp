import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { IUpdateEisCategory } from 'src/common/interfaces';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(): any {
    return this.productService.getProducts();
  }
  @Post()
  addProduct(@Body() dto: { categoryId: string }): any {
    return this.productService.fetchCategory(dto.categoryId);
  }
  @Post('/eis')
  updateProductInEis(@Body() dto: IUpdateEisCategory): any {
    return this.productService.updateProductInEis(dto);
  }
}
