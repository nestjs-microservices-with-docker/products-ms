import { Controller, /* Get, Post, Body, Patch, Param, Delete, Query */ } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@common/dto';
import { IdValidationPipe } from '@common/pipes';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
 
  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'findAll_products' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'findOne_product' })
  findOne(@Payload('id', IdValidationPipe) id: string) {
    return this.productsService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+updateProductDto.id, updateProductDto);
  }

  // @Patch(':id/status')
  @MessagePattern({ cmd: 'update_product_status' })
  updateStatus(@Payload('id', IdValidationPipe) id: string) {
    return this.productsService.updateStatus(+id);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'remove_product' })
  remove(@Payload('id', IdValidationPipe) id: string) {
    return this.productsService.remove(+id);
  }

  @MessagePattern({ cmd: 'validate_products'})
  validateProducts(@Payload() ids: number[]) {
    return this.productsService.validateProducts(ids);
  }
}
