import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';

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
}
