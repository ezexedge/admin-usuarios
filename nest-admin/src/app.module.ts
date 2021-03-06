import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import {PermissionModule} from './permission/permission.module'
import { AbstractService } from './common/abstract.service';
import { ProductModule } from './product/product.module';
import { UploadController } from './upload/upload.controller';
import { OrderModule } from './order/order.module';
@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    RoleModule,
    PermissionModule,
    ProductModule,
    OrderModule

  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
