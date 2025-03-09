import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./products.repository";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "../entities/categories.entity";
import { Product } from "../entities/products.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category])],
    providers: [ProductsService, ProductsRepository],
    controllers: [ProductsController],
})
export class ProductsModule {
    
}