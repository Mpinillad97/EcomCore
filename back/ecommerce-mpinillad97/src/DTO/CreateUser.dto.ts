import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, IsNumber, IsStrongPassword, IsEmpty } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        required: true, 
        description: 'name (obligatorio) - Nombre de usuario',
        example: 'Juan Perez'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    name: string;

    @ApiProperty({
        required: true, 
        description: 'email (obligatorio) - correo electronico',
        example: 'Juan@email.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: true, 
        description: 'password (obligatorio) - Clave del usuario debe tener entre 8 y 15 caracteres e incluir al menos una mayúscula, minúscula y un simbolo',
        example: 'Pass1234!'
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
    password: string;

    @ApiProperty({
        required: true, 
        description: 'Confirm Password (obligatorio) - Confirmación de la contraseña',
        example: 'Pass1234!'
    })
    @IsNotEmpty()
    confirmPassword: string

    @ApiProperty({
        required: true, 
        description: 'address (obligatorio) - Dirección del usuario',
        example: 'Calle 123, Ciudad, País'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    address: string;

    @ApiProperty({
        required: true, 
        description: 'phone (obligatorio) - Número de teléfono del usuario',
        example: 123456789
    })
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @ApiProperty({
        required: false, 
        description: 'country (opcional) - País del usuario',
        example: 'Colombia'
    })
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    country: string;

    @ApiProperty({
        required: false, 
        description: 'city (opcional) - Ciudad del usuario',
        example: 'Medellín'
    })
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    city: string;

    @ApiProperty({
        required: false, 
        description: 'isAdmin (opcional) - Define si el usuario es administrador (solo para uso interno)',
        default: false
    })
    @IsEmpty()
    isAdmin?: boolean
}