import { Order } from "../entities/Orders.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 50, nullable: false, type: 'varchar'})
    name: string;
    
    @Column({length: 50, unique: true, nullable: false, type: 'varchar'})
    email: string;

    @Column({
        nullable: false, 
        type: 'varchar'
    })
    password: string;

    @Column({type: 'bigint'})
    phone: number;
    
    @Column({length: 50, type: 'varchar'})
    country: string;
    
    @Column({type: 'text'})
    address: string;

    @Column({length: 50, type: 'varchar'})
    city: string;

    @Column({type: 'boolean', default: false})
    isAdmin: boolean

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}