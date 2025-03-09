import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator"

export class LoginUserDto {
    @ApiProperty({
        required: true,
        description: "Correo electrónico del usuario",
        example: "Juan@email.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        required: true,
        description: "Contraseña del usuario (debe tener entre 8 y 15 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un símbolo)",
        example: "Pass1234!"
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @IsStrongPassword({
        minUppercase: 1,
        minLowercase: 1,
        minSymbols: 1,
        minNumbers: 1
    })
    password: string
}