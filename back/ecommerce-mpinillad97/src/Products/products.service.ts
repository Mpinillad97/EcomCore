import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { Product } from "../entities/products.entity";



@Injectable()
export class ProductsService{
    constructor(private productsRepository: ProductsRepository){}
    async getProducts(page?: number, limit?: number): Promise<Product[]>{
        return await this.productsRepository.getProducts(page, limit);
    }

    async addProducts(){
        return await this.productsRepository.addProducts()
    }

    async getProductById(id: string): Promise<Product | undefined>{
        return await this.productsRepository.getProductById(id)
    }

    async createProduct(product: Product): Promise<string | undefined>{
        return await this.productsRepository.createProduct(product);
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<string | undefined>{
        return await this.productsRepository.updateProduct(id, product);
    }

    async deleteProduct(id: string): Promise<string | undefined>{
        return await this.productsRepository.deleteProduct(id);
    }
}