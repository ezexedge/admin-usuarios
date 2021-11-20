import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { UploadController } from 'src/upload/upload.controller';
import { Product } from './models/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Product]),
    CommonModule
  ],
  controllers: [ProductController,UploadController],
  providers: [ProductService]
})
export class ProductModule {}
