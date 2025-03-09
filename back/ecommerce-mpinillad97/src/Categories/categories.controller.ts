import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Categories endpoints')
@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService){}

    @Get('seeder')
    addCategories(){
        return this.categoriesService.addCategories()
    }

    @Get()
    getCategories(){
        try {
            return this.categoriesService.getCategories()
        } catch (error) {
            console.error('Error fetching users:', error)
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'error obtaining categories'
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }  
    }
}