import { Order } from "../entities/Orders.entity"
import { OrdersController } from "./orders.controller"
import { Test, TestingModule } from "@nestjs/testing"
import { OrdersService } from "./orders.service"
import { AuthGuard } from "../guards/auth.guard"
import { JwtService } from "@nestjs/jwt"
import { CreateOrderDto } from "src/DTO/CreateOrder.dto"
import { User } from "src/entities/user.entity"
import { OrderDetail } from "src/entities/OrderDetails.entity"

describe('Orders Controller', () => {
    let controller: OrdersController
    let mockOrdersService

    const mockOrders: Partial<Order>[] = [
        {
            id: "123e4567-e89b-12d3-a456-426614174000",
            user: {id: "1"} as User,
            date: new Date(),
            orderDetails: {id: "order-1", price: 29.99, products: [{id: "prod-1", price: 29.99}]} as OrderDetail
        },
        {
            id: "123e4567-e89b-12d3-a456-426614174001",
            user: { id: "2" } as User, 
            date: new Date(),
            orderDetails: { id: "order-2", price: 19.99, products: [{ id: "prod-3", price: 19.99 }] } as OrderDetail
        }        
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                {
                    provide: OrdersService,
                    useValue: {
                        addOrder: jest.fn().mockResolvedValue({ id: "123e4567-e89b-12d3-a456-426614174002" }),
                        getOrder: jest.fn().mockImplementation((id: string) => {
                            return mockOrders.find(order => order.id === id) || undefined;
                        })
                    }
                },
                {
                    provide: AuthGuard,
                    useValue: {
                        canActivate: jest.fn().mockReturnValue(true)
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-token'),
                        verify: jest.fn().mockReturnValue({userId: 'mock-user-id'})
                    }
                }
            ]
            
        }).compile()
        controller = module.get<OrdersController>(OrdersController)
        mockOrdersService = module.get<OrdersService>(OrdersService)
    })
    
    describe('addOrders', () => {
        it('it should create an order and return the created order', async () => {
            const newOrder: CreateOrderDto = {
                userId: "123e4567-e89b-12d3-a456-426614174000",
                products: [{
                    id: "prod-1",
                    name: "Test Product",  
                    description: "Test description",
                    price: 10,
                    stock: 100,
                    imgUrl: "https://example.com/default-image.jpg",
                    category: null, 
                    orderDetails: []
                }]
            };
            const createdOrder = { id: "123e4567-e89b-12d3-a456-426614174002" };
            mockOrdersService.addOrder.mockResolvedValue(createdOrder);

            const result = await controller.addOrder(newOrder);

            expect(result).toEqual(createdOrder)
            expect(mockOrdersService.addOrder).toHaveBeenCalledWith(newOrder.userId, newOrder.products);
            expect(mockOrdersService.addOrder).toHaveBeenCalledTimes(1)
        })

        it('It should throw an error if addOrder fails', async() => {
            const newOrder: CreateOrderDto = {
                userId: "123e4567-e89b-12d3-a456-426614174000",
                products: [{ id: "prod-1", name: "Test Product", description: "Test description", price: 10, stock: 100, imgUrl: "https://example.com/default-image.jpg", category: null, orderDetails: [] }]
            };
            mockOrdersService.addOrder.mockRejectedValue(new Error('Error creating the order'))

            await expect(controller.addOrder(newOrder)).rejects.toThrow('Error creating the order');
            expect(mockOrdersService.addOrder).toHaveBeenCalledWith(newOrder.userId, newOrder.products);
            expect(mockOrdersService.addOrder).toHaveBeenCalledTimes(1)

        })
    })

    describe('getOrder', () => {
        it('It should return an order if the ID is valid', async () => {
            const result = await controller.getOrder(mockOrders[0].id);

            expect(result).toEqual(mockOrders[0])
            expect(mockOrdersService.getOrder).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000");
            expect(mockOrdersService.getOrder).toHaveBeenCalledTimes(1);
        })

        it('It should return undefined if the order does not exists', async () => {
            const result = await controller.getOrder("123e4567-e89b-12d3-a456-426614174999")

            expect(result).toBeUndefined()
            expect(mockOrdersService.getOrder).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174999")
            expect(mockOrdersService.getOrder).toHaveBeenCalledTimes(1)
        })
    })
})