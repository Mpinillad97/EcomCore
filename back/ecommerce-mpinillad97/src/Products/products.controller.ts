import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, Query, UseGuards, ParseUUIDPipe, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { validateProduct } from "../utils/validate";
import { AuthGuard } from "../guards/auth.guard";
import { Product } from "../entities/products.entity";
import { RolesGuard } from "../guards/roles.guard";
import { Role } from "../enum/roles.enum";
import { Roles } from "../decorators/roles/roles.decorator";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags('Products endpoints')
@Controller('products')
export class ProductsController{
    constructor(private readonly productsService: ProductsService){}

    
    @Get()
    @HttpCode(200)
    getProducts(@Query('page') page?: string, @Query('limit') limit?: string){
        try {
            return this.productsService.getProducts(parseInt(page), parseInt(limit));
        } catch (error) {
            console.error('Error fetching users:', error)
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error obtaining products"
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('seeder')
    addProducts(){
        return this.productsService.addProducts()
    }

    
    @Get(':id')
    @HttpCode(200)
    getProductById(@Param('id', ParseUUIDPipe) id: string){
        return this.productsService.getProductById(id)
    }

    @ApiBearerAuth()
    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard)
    createProduct(@Body() product: Product){
        // if(validateProduct(product)){
            return this.productsService.createProduct(product)
        // }
        // return "Product Not Valid"
    }

    @ApiBearerAuth()
    @Put(':id')
    @HttpCode(200)
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBody({type: Product})
    updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() product: Partial<Product>){
        if(!Object.keys(product).length) throw new BadRequestException('Values to update were not sent')
        return this.productsService.updateProduct(id, product)
    }

    @ApiBearerAuth()
    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    deleteProduct(@Param('id', ParseUUIDPipe) id: string){
        return this.productsService.deleteProduct(id)
    }
}
