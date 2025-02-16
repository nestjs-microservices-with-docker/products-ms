## Steps to develop products microservice with Prisma

1. Execute the following command on the terminal

```bash
nest new <microservice_name_project>
```

2. Once the dependecies installation is completed, run the following command

```bash
nest g res <resource_name>
```

3. Add validation for env variables, this way you prevent the application crashes when one variable is not defined. To do that, follow the next steps

    1. Install joi and dotenv

    ```bash
      npm install joi dotenv
    ```

    2. Create a folder call within src folder called 'config'
    3. Add the following code

    ```ts
    import 'dotenv/config';
    import * as joi from 'joi';

    interface EnvVars {
      PORT: number;
    }

    const envsSchema = joi
      .object({
        PORT: joi.number().required(),
      })
      .unknown(true);

    const { error, value } = envsSchema.validate(process.env);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    const envVars: EnvVars = value;

    export const envs = {
      port: envVars.PORT,
    };
    ```

    4. Now replace the way port is declared in main.ts for the port in config/envs.ts this way:

    ```ts
    await app.listen(envs.port);
    ```

    5. Now restart the server, create a file .env where you have to declare the port env variable, and finally run the server again. If everything went well the server must be running without any error.

4. Install and configure prisma so that it will be the ORM used for this project. To do that follow the next steps:

    1. Install prisma by running the following command:

    ```bash
    npm install -D prisma
    ```

    2. Initialize prisma

    ```bash
    npx prisma init
    ```

    3. Replace the DATABASE_URL for the next one because we're gonna be using sqlite

    ```env
    DATABASE_URL=file:./dev.db
    ```

    4. The go to the schema.prisma file to update the database used and add the model for products

    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "sqlite"
      url      = env("DATABASE_URL")
    }

    model Product {
      id Int @id @default(autoincrement())
      name String
      price Float
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    ```

    5. Update envs file because we just added it a new env variable
    6. Generate your SQL migration by running the following command in your terminal

    ```bash
    npx prisma migrate dev --name init
    ```

    7. Now for last install the prisma client so that you can use the models you declare through the app

    ```bash
    npm install @prisma/client
    ```

5. Once you completed the configuration for prisma, you have to create a module for prisma with its respective service file. Inside the service, paste the following code:

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

6. Do not forget to import the prisma module within the app module

```ts
imports: [ProductsModule, PrismaModule];
```

7. Then you can import the prisma module within any module, in this case you can import it within the products module this way

```ts
imports: [PrismaModule];
```

8. In your products service you have to instance in the constructor the prisma service this way

```ts
constructor(
  private readonly prisma: PrismaService
){}
```

9. Now you can use it to do CRUD operations

```ts
create(createProductDto: CreateProductDto) {
  return this.prisma.product.create({
    data: createProductDto
  })
}
```

10. To visualize the data of the products table, you can use any client databases, or you can run the following command which opens a new tab on your default browser to show your data in a friendly way

```bash
npx prisma studio
```

11. It's time to seed the products database. You can code by your own a seeder the way you seed the database by just running a command, or, you can use the following INSERT sql code and just paste it in a sql editor the way you have data to use

```sql
INSERT INTO Product (name, price, createdAt, updatedAt) VALUES
('Teclado', 75.25, 1709049027545, 1709049027545),
('Mouse', 150.0, 1709049041977, 1709049041977),
('Monitor', 150.0, 1709049047955, 1709049047955),
('Audífonos', 50.0, 1709049048406, 1709049048406),
('Laptop', 1000.0, 1709049048754, 1709049048754),
('Smartphone', 800.0, 1709049058406, 1709049058406),
('Tablet', 300.0, 1709049063205, 1709049063205),
('Impresora', 200.0, 1709049068123, 1709049068123),
('Altavoces', 150.0, 1709049073021, 1709049073021),
('Cámara', 400.0, 1709049077943, 1709049077943),
('Televisor', 700.0, 1709049082912, 1709049082912),
('Router', 80.0, 1709049087876, 1709049087876),
('Reproductor Blu-ray', 180.0, 1709049092805, 1709049092805),
('Teclado inalámbrico', 60.0, 1709049097701, 1709049097701),
('Mouse inalámbrico', 80.0, 1709049102663, 1709049102663),
('Webcam', 70.0, 1709049107602, 1709049107602),
('Tarjeta de video', 250.0, 1709049112487, 1709049112487),
('Memoria RAM', 120.0, 1709049117415, 1709049117415),
('Disco duro externo', 150.0, 1709049122337, 1709049122337),
('Tarjeta madre', 350.0, 1709049127245, 1709049127245),
('Procesador', 300.0, 1709049132156, 1709049132156),
('Gabinete para PC', 80.0, 1709049137078, 1709049137078),
('Fuente de poder', 100.0, 1709049141998, 1709049141998),
('Router inalámbrico', 50.0, 1709049146924, 1709049146924),
('Adaptador Wi-Fi USB', 30.0, 1709049151830, 1709049151830),
('Cargador portátil', 40.0, 1709049156726, 1709049156726),
('Batería de repuesto', 50.0, 1709049161615, 1709049161615),
('Mochila para laptop', 40.0, 1709049166562, 1709049166562),
('Estuche para tablet', 20.0, 1709049171487, 1709049171487),
('Cable HDMI', 10.0, 1709049176416, 1709049176416),
('Adaptador de corriente', 20.0, 1709049181319, 1709049181319),
('Soporte para monitor', 30.0, 1709049186250, 1709049186250),
('Base para laptop', 25.0, 1709049191148, 1709049191148),
('Teclado numérico', 15.0, 1709049196075, 1709049196075),
('Mouse ergonómico', 35.0, 1709049200976, 1709049200976),
('Auriculares con micrófono', 50.0, 1709049205910, 1709049205910),
('Control remoto universal', 20.0, 1709049210831, 1709049210831),
('Base para smartphone', 15.0, 1709049215765, 1709049215765),
('Adaptador de audio Bluetooth', 25.0, 1709049220648, 1709049220648),
('Lector de tarjetas de memoria', 15.0, 1709049225590, 1709049225590),
('Cable USB-C', 10.0, 1709049230512, 1709049230512),
('Cable Lightning', 10.0, 1709049235427, 1709049235427),
('Cable VGA', 10.0, 1709049240329, 1709049240329),
('Cable DisplayPort', 10.0, 1709049245243, 1709049245243),
('Cable de red Ethernet', 10.0, 1709049250141, 1709049250141),
('Bolsa para laptop', 25.0, 1709049255042, 1709049255042),
('Almohadilla para mouse', 15.0, 1709049259956, 1709049259956);
```

12. Now it's time to go ahead with the rest of CRUD operations. To do that we can continue with getting product. But to do it professionally, we are gonna add pagination. So first of all, create a pagination dto in the next folder: src/common/dto. And there add the following code:

```ts
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
```

Then use that code inside productS controller like this:

```ts
// src/products/product.controller.ts
@Get()
findAll(@Query() paginationDto: PaginationDto) {
  return this.productsService.findAll(paginationDto);
}
```

13. Now in the findAll method of products service, we have to add the logic necessary to page the products

```ts
async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto

    const total = await this.prisma.product.count({});
    const lastPage = Math.ceil(total / limit);

    const data = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
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

```

What that method does is the following:

1. Count how many results we have in our database
2. Calculate the number of pages we can return based on the limit paramater provided
3. then skips the amount resulting from the multiplication of page minus 1 by the limit provided, this way, if we are on page 1 no record will be skipped, on page 2 10 records will be skipped and so on

4. Now try to complete the findOne and update methods using the methods prisma provides for each model

5. For the delete operation, we will do it by implementing a logical delete, I mean, by using a flag (active or available). To do that we have to update our prisma model

```prisma
model Product {
  id Int @id @default(autoincrement())
  name String
  price Float
  available Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([available])
}
```

Note that we also added an index, this way our query will be faster

16. Then with that change applied, we have to run a new migration

```bash
npx prisma migrate dev --name add-available-column-with-index
```

17. If the previous command was executed without any error, we can add the logic for our delete method

```ts
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
```

18. Now once we have tested our endpoints work as expected, we can turn our application into a microservice. To do that we have to do the following
    1. Install the @nestjs/microservices
    ```bash
    npm install @nestjs/microservices
    ```
    2. Update your main.ts file
    ```ts
    import { MicroserviceOptions, Transport } from '@nestjs/microservices';

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: envs.port
        }
      });
    ```
    This change will cause your application do not response to a call http, but that is exactly what we want
    3. Now, update your product controller like this
    ```ts
    import { MessagePattern, Payload } from '@nestjs/microservices';

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
    }
    ```
    If you see, wa have replaced Body, Param and Query for Payload, and the https methods for MessagePattern. With this change you maybe will have a incoveniente with the update method, so apply the next change
    ```ts
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
    ```
    And also update the update product dto
    ```ts
    import { Type } from 'class-transformer';
    import { IsString, Min, IsNumber, IsBoolean, IsBooleanString, IsPositive } from 'class-validator';

    export class UpdateProductDto {

      @IsNumber()
      @IsPositive()
      id: number

      @IsString()
      name: string

      @IsNumber({
        maxDecimalPlaces: 2
      })
      @Min(1)
      @Type(() => Number)
      price: number
    }

    ```