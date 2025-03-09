import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../DTO/CreateUser.dto";
import { User } from "../entities/user.entity";
import { UsersRepository } from "../Users/users.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthRepository {
    constructor(
        private readonly usersRepository: UsersRepository,
        private jwtService: JwtService
    ){}

    async signIn(email: string, password: string){
            const user = await this.usersRepository.findByEmail(email);
            const matchPassword = bcrypt.compare(password, user.password);
            if(!matchPassword || !user) throw new BadRequestException('Credentials are not valid')
            const userPayload = {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin,
            }
            const token = this.jwtService.sign(userPayload)
            return {
                token,
                message: 'User logged in successfully'
            }
        }
    
        async signup(user: CreateUserDto): Promise<Partial<User>>{
                const userFound = await this.usersRepository.findByEmail(user.email)
                if(userFound) throw new BadRequestException('An account with this email already exists!')
                if(user.password !== user.confirmPassword) throw new BadRequestException('Passwords do not match');
                const hashedPassword = await bcrypt.hash(user.password, 10);
                if(!hashedPassword) throw new BadRequestException('Password could not be hashed');
                await this.usersRepository.createUser({...user, password: hashedPassword})
                const {password, confirmPassword, ...userWithoutPassword} = user
                return userWithoutPassword;
            }
}