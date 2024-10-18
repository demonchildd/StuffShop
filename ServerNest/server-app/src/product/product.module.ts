import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    FilesModule
  ],
})
export class ProductModule {}
