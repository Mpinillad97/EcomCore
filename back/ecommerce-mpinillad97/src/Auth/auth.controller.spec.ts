import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtService } from "@nestjs/jwt"
import { BadRequestException } from "@nestjs/common"

describe('Auth Controller', () => {
    let controller: AuthController
    let mockAuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signIn: jest.fn().mockResolvedValue({
                            token: 'fake-jwt-token',
                            message: 'User logged in successfully'
                        }),
                        signUp: jest.fn().mockResolvedValue({
                            id: "1",
                            email: 'mockUser@example.com',
                            isAdmin: false
                        })
                    }
                }
            ]
        }).compile()
        controller = module.get<AuthController>(AuthController)
        mockAuthService = module.get<AuthService>(AuthService)
    })

    it('Controller should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('signUp', () => {
        it('It should register a new user successfully', async () => {
            const userToSignUp = { 
                name: 'Test User', 
                email: 'mockUser@email.com', 
                password: 'password123', 
                confirmPassword: 'password123', 
                address: '123 Main St', 
                phone: 1234567890, 
                country: 'USA', 
                city: 'New York' 
            }
            const result = await controller.signUp(userToSignUp)
            expect(mockAuthService.signUp).toHaveBeenCalledWith(userToSignUp)
            expect(result).toEqual({
                id: "1",
                email: 'mockUser@example.com',
                isAdmin: false
            })
        })

        it('should throw an error if passwords do not match', async () => {
            const userToSignUp = { 
                name: 'Test User', 
                email: 'mockUser@email.com', 
                password: 'password123', 
                confirmPassword: 'password123', 
                address: '123 Main St', 
                phone: 1234567890, 
                country: 'USA', 
                city: 'New York' 
            };
    
            mockAuthService.signUp.mockRejectedValueOnce(new BadRequestException('Passwords do not match'));
    
            await expect(controller.signUp(userToSignUp)).rejects.toThrow(BadRequestException);
            expect(mockAuthService.signUp).toHaveBeenCalledWith(userToSignUp);
        });
    
        it('should throw an error if password hashing fails', async () => {
            const userToSignUp = { 
                name: 'Test User', 
                email: 'mockUser@email.com', 
                password: 'password123', 
                confirmPassword: 'password123', 
                address: '123 Main St', 
                phone: 1234567890, 
                country: 'USA', 
                city: 'New York' 
            }
    
            mockAuthService.signUp.mockRejectedValueOnce(new BadRequestException('Password could not be hashed'));
    
            await expect(controller.signUp(userToSignUp)).rejects.toThrow(BadRequestException);
            expect(mockAuthService.signUp).toHaveBeenCalledWith(userToSignUp);
        });
    
        it('should throw a general error if signUp fails', async () => {
            const userToSignUp = { 
                name: 'Test User', 
                email: 'mockUser@email.com', 
                password: 'password123', 
                confirmPassword: 'password123', 
                address: '123 Main St', 
                phone: 1234567890, 
                country: 'USA', 
                city: 'New York' 
            };
    
            mockAuthService.signUp.mockRejectedValueOnce(new Error('Unexpected error'));
    
            await expect(controller.signUp(userToSignUp)).rejects.toThrow('Unexpected error');
            expect(mockAuthService.signUp).toHaveBeenCalledWith(userToSignUp);
        });
    })

    describe('signIn', () => {
        it('should authenticate a user successfully', async () => {
            const credentials = { email: 'mockUser@email.com', password: 'password123' }
            const result = await controller.signIn(credentials)
            
            expect(mockAuthService.signIn).toHaveBeenCalledWith(credentials.email, credentials.password)
            expect(result).toEqual({
                token: 'fake-jwt-token',
                message: 'User logged in successfully'
            })
        })

        it('should throw an error if credentials are invalid', async () => {
            mockAuthService.signIn.mockRejectedValue(new Error('Invalid credentials'))
        
            const credentials = { email: 'invalid@email.com', password: 'wrongPassword' }
        
            await expect(controller.signIn(credentials)).rejects.toThrow('Invalid credentials')
        })

        it('should return a JWT token', async () => {
            const credentials = { email: 'mockUser@email.com', password: 'password123' }
            const result = await controller.signIn(credentials)
        
            expect(result).toHaveProperty('token')
            expect(typeof result.token).toBe('string')
        })

        it('should call signIn only once per login attempt', async () => {
            const credentials = { email: 'mockUser@email.com', password: 'password123' }
            await controller.signIn(credentials)
        
            expect(mockAuthService.signIn).toHaveBeenCalledTimes(1)
        })
        
        
    })
})