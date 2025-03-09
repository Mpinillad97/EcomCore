import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { In, Repository } from "typeorm";
import { Order } from "../entities/Orders.entity";
import { OrderDetail } from "../entities/OrderDetails.entity";
import { Product } from "../entities/products.entity";

@Injectable()
export class OrdersRepository{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail)
        private orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ){}

    async addOrder(userId: string, products: any){
        let total = 0
        // Busca al usuario y devuelve un error en caso de no encontrarlo
        const user = await this.userRepository.findOneBy({id: userId})
        if(!user) throw new NotFoundException(`User with id ${userId} not found`);
        // Crea la orden con el usuario
        const order = new Order()
        order.date = new Date()
        order.user = user
        const newOrder = await this.orderRepository.save(order);
        // Busca los productos a partir de los id
        const productsIds = products.map((p) => p.id)
        const foundProducts = await this.productRepository.find({
            where: {id: In(productsIds)}
        })
        // Verifica si algun producto no existe
        const foundProductsIds = new Set(foundProducts.map((p) => p.id))
        const missingProducts = productsIds.filter((id) => !foundProductsIds.has(id))
        if(missingProducts.length > 0) throw new NotFoundException(`The following products do not exist: ${missingProducts.join(", ")}`)
        // Separa productos con y sin stock
        const availableProducts = foundProducts.filter((product) => product.stock > 0);
        const outOfStockProducts = foundProducts.filter((product) => product.stock <= 0);
        // Lanza error si todos los productos estan sin stock
        if(availableProducts.length === 0) throw new BadRequestException(`All selected products are out of stock: ${outOfStockProducts.map((p) => p.id).join(", ")}`)
        // Calcula el total de la orden con productos disponibles
        total = availableProducts.reduce((sum, product) => sum + Number(product.price), 0)
        // Actualiza el Stock de productos
        await Promise.all(
            availableProducts.map((product) =>
                this.productRepository.update({ id: product.id }, { stock: product.stock - 1 })
            )
        );
        // Crea el Order Detail
        const orderDetail = new OrderDetail()
        orderDetail.price = Number(Number(total).toFixed(2))
        orderDetail.products = availableProducts;
        orderDetail.order = newOrder;
        await this.orderDetailRepository.save(orderDetail);
        // Retorna la orden con del detail
        return await this.orderRepository.find({
            where: {id: newOrder.id},
            relations: {
                orderDetails: true,
            }
        })
    }

    async getOrder(id: string){
        const order = await this.orderRepository.findOne({
            where: {id},
            relations: {
                orderDetails: {
                    products: true
                }
            }
        })
        if(!order) throw new NotFoundException(`Order with id ${id} not found`);
        return order
    }
}