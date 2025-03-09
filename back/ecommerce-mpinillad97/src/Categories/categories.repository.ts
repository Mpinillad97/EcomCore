import { Injectable } from "@nestjs/common";
import * as data from '../utils/seeders/data.json'
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/categories.entity";
import { Repository } from "typeorm";


@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ){}

    async getCategories(){
        return await this.categoriesRepository.find()
    }

    async addCategories(){
        for(const element of data){
            const categoryExists = await this.categoriesRepository.findOne({
                where: { name: element.category }
            })
            if(!categoryExists){
                const newCategory = await this.categoriesRepository.create({
                    name: element.category
                })
                await this.categoriesRepository.save(newCategory)
            }
        }
        return 'Categories added'
    }

}