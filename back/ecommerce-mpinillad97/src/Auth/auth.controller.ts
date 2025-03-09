import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../DTO/LoginUser.dto";
import { CreateUserDto } from "../DTO/CreateUser.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth endpoints')
@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @HttpCode(201)
    @Post('signin')
    signIn(@Body() credentials: LoginUserDto ){
        const {email, password} = credentials;
        return this.authService.signIn(email, password)
    }

    @HttpCode(201)
    @Post('signup')
    signUp(@Body() user: CreateUserDto){
        return this.authService.signUp(user)
    }

}