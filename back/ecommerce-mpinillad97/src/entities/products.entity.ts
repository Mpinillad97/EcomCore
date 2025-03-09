import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./OrderDetails.entity";
import { Category } from "./categories.entity";


@Entity({
    name: 'products'
})
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "varchar", length:50, nullable: false, unique: true})
    name: string;

    @Column({type: 'text', nullable: false})
    description: string;

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: false})
    price: number;

    @Column({type: 'int', nullable: false})
    stock: number;

    @Column({type: 'text', default: 'https://example.com/default-image.jpg'})
    imgUrl: string;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({name: 'category_id'})
    category: Category;

    @ManyToMany(() => OrderDetail, (OrderDetail) => OrderDetail.products)
    orderDetails: OrderDetail[];
}