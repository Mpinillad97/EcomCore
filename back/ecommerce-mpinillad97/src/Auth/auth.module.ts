import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../Users/users.module";
import { AuthRepository } from "./auth.repository";

@Module({
    imports: [UsersModule],
    providers: [AuthService, AuthRepository],
    controllers: [AuthController]
})
export class AuthModule {
    
}