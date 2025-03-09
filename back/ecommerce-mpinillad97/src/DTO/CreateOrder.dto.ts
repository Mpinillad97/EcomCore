import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { Product } from "../entities/products.entity";
import { ApiProperty } from "@nestjs/swagger";


export class CreateOrderDto {
    @ApiProperty({
        required: true,
        description: "userId (obligatorio) - Identificador único del usuario que realiza la orden",
        example: "550e8400-e29b-41d4-a716-446655440000"
    })
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @ApiProperty({
        required: true,
        description: "products (obligatorio) - Lista de productos incluidos en la orden",
        example: [
            { id: "123e4567-e89b-12d3-a456-426614174000", name: "Laptop", price: 999.99, quantity: 1 },
            { id: "123e4567-e89b-12d3-a456-426614174001", name: "Mouse", price: 49.99, quantity: 2 }
        ]
    })
    @IsArray()
    @ArrayMinSize(1)
    products: Partial<Product[]>
}