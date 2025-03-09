import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as data from '../utils/seeders/data.json'
import { Category } from "../entities/categories.entity";
import { Product } from "../entities/products.entity";


@Injectable()
export class ProductsRepository{
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>
    ){}
  
    async getProducts(page?: number, limit?: number): Promise<Product[]>{
        const pageNumber = page && page > 0 ? page : 1;
        const limitNumber = limit && limit > 0 ? limit: 5;
        const products = await this.productsRepository.find({
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
            relations: {
                category: true
            }
        }) 

        let inStock = products.filter((product) => product.stock > 0)
        
        return inStock;  
    }

    async addProducts(){
        const categories = await this.categoriesRepository.find()

        data?.map(async (element) => {
            const relatedCategory = categories.find(
                (category) => category.name === element.category,
            )
            
            const product = new Product()
            product.name = element.name
            product.description = element.description
            product.price = element.price
            product.stock = element.stock
            product.category = relatedCategory

            await this.productsRepository
                .createQueryBuilder()
                .insert()
                .into(Product)
                .values(product)
                .orUpdate(['description', 'price', 'stock'], ['name'])
                .execute()
        })
        return 'Productos agregados'
    }

    async getProductById(id: string): Promise<Product | undefined>{
        const product = await this.productsRepository.findOneBy({id})
        if(!product){
            throw new NotFoundException('Product Not Found')
        }
        return product;
    }

    async createProduct(product: Product): Promise<string | undefined>{
        let categoryExists = await this.categoriesRepository.findOne({
            where: {name: product.category.name}
        })

        if(!categoryExists){
            categoryExists = this.categoriesRepository.create({
                name: product.category.name
            })
            await this.categoriesRepository.save(categoryExists)
        }
        const newProduct = this.productsRepository.create({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: categoryExists
        });
        try {
            await this.productsRepository.save(newProduct);
            return newProduct.id;
        } catch (error) {
            if (error.code === "23505") {
                // Código 23505 → Violación de restricción única (nombre repetido)
                throw new ConflictException("A product with this name already exists");
            }
            throw new InternalServerErrorException("An error ocurred while saving the product");
        }   
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<string | undefined>{
        try {
            const foundUser = await this.productsRepository.findOneBy({id}) 
            if(!foundUser) throw new NotFoundException(`Product with id ${id} not found`)
            await this.productsRepository.update(id, product)
            const updatedProduct = await this.productsRepository.findOneBy({id})
            if(!updatedProduct) throw new InternalServerErrorException('Error updating the product')
            return updatedProduct.id
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Error updating the product')
        }
    }

    async deleteProduct(id: string): Promise<string | undefined>{
        const existingProduct = await this.productsRepository.findOneBy({id})
        if(!existingProduct){
            throw new NotFoundException(`Product with id ${id} not found`)
        }
        await this.productsRepository.remove(existingProduct);
        return id;
    }
}