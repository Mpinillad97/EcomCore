import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){}

    async getUsers(page?: number, limit?: number): Promise<Partial<User>[]> {
        const pageNumber = page && page > 0 ? page : 1;
        const limitNumber = limit && limit > 0 ? limit: 5
        let users = await this.usersRepository.find({
            take: limitNumber,
            skip: (pageNumber -  1) * limitNumber 
        })
        
        return users.map(({ password, isAdmin, ...user }) => user)
    }

    async getUserById(id: string): Promise<Partial<User> | undefined> {
        let foundUser = await this.usersRepository.findOne({
            where: {id},
            relations: {
                orders: true
            }
        })
        if(!foundUser) throw new NotFoundException(`User with id ${id} not found`)
        const orderSummary = foundUser.orders.map(order => ({
            id: order.id,
            date: order.date
        }))
        const {password, isAdmin, orders, ...userWithoutPassword} = foundUser

        return {...userWithoutPassword, orders: orderSummary as any}
    }

    async createUser(user: Partial<User>): Promise<string>{
        const newUser = await this.usersRepository.save(user);
        return newUser.id;
    }

    async updateUser(id: string, user: Partial<User>): Promise<string | undefined> {
        try {
            const existingUser = await this.usersRepository.findOneBy({id});
            if(!existingUser) throw new NotFoundException(`User with id ${id} not found`)
            await this.usersRepository.update(id, user)
            const updatedUser = await this.usersRepository.findOneBy({id})
            if(!updatedUser) throw new InternalServerErrorException(`Error updating user`)
            return updatedUser.id
        } catch (error) {
            throw new InternalServerErrorException(error.message || `Error updating user`)
        }
    }
    
    async deleteUser(id: string): Promise<string | undefined>{
        const user = await this.usersRepository.findOneBy({id});
        if(!user) throw new NotFoundException(`User with id ${id} not found`);
        this.usersRepository.remove(user);
        return user.id;
    }

    async findByEmail(email: string): Promise<Partial<User> | undefined> {
        const foundUser = await this.usersRepository.findOneBy({email});
        return foundUser;
    }
}