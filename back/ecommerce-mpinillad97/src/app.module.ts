import { Module } from '@nestjs/common';
import { UsersModule } from './Users/users.module';
import { ProductsModule } from './Products/products.module';
import { AuthModule } from './Auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './Categories/categories.module';
import { OrderModule } from './Orders/orders.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import typeorm from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm')
  }), 
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: '60m'},
  }),
  UsersModule, 
  ProductsModule, 
  AuthModule,
  CategoriesModule,
  OrderModule,
  FileUploadModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
