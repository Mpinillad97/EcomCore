import { User } from "../entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./OrderDetails.entity";

@Entity({
    name: 'orders'
})
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;
    
    @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
    orderDetails: OrderDetail
    
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({name: 'user_id'})
    user: User;
}