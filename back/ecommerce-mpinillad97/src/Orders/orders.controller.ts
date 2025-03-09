import { Controller, Post, Get, Body, Param, ParseUUIDPipe, UseGuards, HttpException, HttpStatus } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "../DTO/CreateOrder.dto";
import { AuthGuard } from "../guards/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Orders endpoints')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService){}

    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard)
    addOrder(@Body() order: CreateOrderDto){
        const { userId, products } = order
        return this.ordersService.addOrder(userId, products)
    }

    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard)
    getOrder(@Param('id', ParseUUIDPipe) id: string){
        try {
            return this.ordersService.getOrder(id)
        } catch (error) {
            console.error('Error fetching users:', error)
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error obtaining products"
                }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
    }
}