import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseUUIDPipe, Put, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { validateUser } from "../utils/validate";
import { AuthGuard } from "../guards/auth.guard";
import { CreateUserDto } from "../DTO/CreateUser.dto";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles/roles.decorator";
import { Role } from "../enum/roles.enum";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";


@ApiTags('Users endpoints')
@Controller('users')
export class UsersController{
    constructor(private readonly usersService: UsersService){}

    @ApiBearerAuth()
    @Get()
    @HttpCode(200)
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    getUsers(@Query('page') page?: string, @Query('limit') limit?: string){
        try {
            return this.usersService.getUsers(parseInt(page), parseInt(limit));
        } catch (e) {
            console.error('Error fetching users:', e)
            throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error obtaining users"
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiBearerAuth()
    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    getUserById(@Param('id', ParseUUIDPipe) id: string){
        return this.usersService.findUserById(id);
    }

    @ApiBearerAuth()
    @Put(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBody({type: CreateUserDto})
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: Partial<CreateUserDto>){
        if (!Object.keys(user).length) {  
            throw new BadRequestException('Values to update were not sent');
        }
        return this.usersService.updateUser(id, user);
        
    }

    @ApiBearerAuth()
    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    deleteUser(@Param('id', ParseUUIDPipe) id: string){
        return this.usersService.deleteUser(id);
    }
}