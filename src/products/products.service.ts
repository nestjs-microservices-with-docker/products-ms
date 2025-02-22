import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '@common/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prisma: PrismaService
  ){}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto
    })
  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto

    const total = await this.prisma.product.count({
      where: {
        available: true
      }
    });
    const lastPage = Math.ceil(total / limit);

    const data = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        available: true
      }
    });

    return {
      data,
      meta: {
        page,
        total,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id
      }
    })

    if (!product) {
      throw new RpcException(`Product with id #${id} not found`)
    }

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: _, ...data } = updateProductDto

    await this.findOne(id)

    return this.prisma.product.update({
      where: {
        id
      },
      data,
    })
  }

  async remove(id: number) {
    // logical delete
    await this.findOne(id)
    
    return this.prisma.product.update({
      where: {
        id
      },
      data: {
        available: false
      }
    })
  }

  async updateStatus(id: number) {
    // logical delete
    await this.findOne(id)
    
    return this.prisma.product.update({
      where: {
        id
      },
      data: {
        available: true
      }
    })
  }

  async validateProducts(ids: number[]) {

    ids = Array.from(new Set(ids))

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids
        },
      }
    })
    
    if (products.length !== ids.length) {
      throw new RpcException({
        message: `Some products not found or are not available: ${ids.filter(id => !products.find(p => p.id === id))}`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    return products
  }
}
