import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersRepository } from "./orders.repository";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Order } from "../entities/Orders.entity";
import { Product } from "../entities/products.entity";
import { OrderDetail } from "../entities/OrderDetails.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Order]),
        TypeOrmModule.forFeature([OrderDetail])
    ],
    providers: [OrdersService, OrdersRepository],
    controllers: [OrdersController],
})
export class OrderModule {}