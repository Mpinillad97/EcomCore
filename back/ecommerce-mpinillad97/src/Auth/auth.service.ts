import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../DTO/CreateUser.dto";
import { User } from "../entities/user.entity";
import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService{
    constructor(private authRepository: AuthRepository){}

    async signIn(email: string, password: string){
        return await this.authRepository.signIn(email, password)
    }

    async signUp(user: CreateUserDto): Promise<Partial<User>>{
        return await this.authRepository.signup(user)  
    }
}