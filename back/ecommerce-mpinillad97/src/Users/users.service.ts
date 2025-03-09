import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersService{
    constructor(private usersRepository: UsersRepository){}

    getUsers(page?: number, limit?: number): Promise<Partial<User>[]>{
        return this.usersRepository.getUsers(page, limit);
    }

    findUserById(id: string): Promise<Partial<User>|undefined>{
        return this.usersRepository.getUserById(id)
    }

    createUser(user: Partial<User>): Promise<string>{
        return this.usersRepository.createUser(user);
    }

    updateUser(id: string, user: Partial<User>): Promise<string>{
        return this.usersRepository.updateUser(id, user);
    }

    deleteUser(id: string): Promise<string>{
        return this.usersRepository.deleteUser(id);
    }

    findByEmail(email: string): Promise<Partial<User> | undefined>{
        return this.usersRepository.findByEmail(email)
    }
}
