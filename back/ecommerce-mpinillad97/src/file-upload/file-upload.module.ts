import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { fileUploadRepository } from './file-upload.repository';
import { cloudinaryConfig } from '../config/cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [FileUploadController],
  providers: [FileUploadService, fileUploadRepository, cloudinaryConfig],
})
export class FileUploadModule {}
