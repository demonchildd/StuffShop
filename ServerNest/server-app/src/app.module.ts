import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtJwtGuard } from './auth/guard';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BasketModule } from './basket/basket.module';
import { OrderModule } from './order/order.module';
import { FilesModule } from './files/files.module';
import { SocketService } from './socket/socket.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule, 
    UserModule, 
    PrismaModule, 
    CategoryModule, 
    ProductModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'), // Путь к директории с вашими статическими файлами
    }),
    BasketModule,
    OrderModule,
    FilesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtJwtGuard
    },
    SocketService
  ]
})
export class AppModule {}
