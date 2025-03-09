import { Module } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "../entities/categories.entity";

@Module({
    providers: [CategoriesRepository, CategoriesService],
    controllers: [CategoriesController],
    imports: [TypeOrmModule.forFeature([Category])]
})
export class CategoriesModule{}