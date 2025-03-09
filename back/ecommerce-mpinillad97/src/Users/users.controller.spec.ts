import { User } from "src/entities/user.entity"
import { UsersController } from "./users.controller"
import { Test, TestingModule } from "@nestjs/testing"
import { UsersService } from "./users.service"
import { AuthGuard } from "../guards/auth.guard"
import { JwtService } from "@nestjs/jwt"
import { BadRequestException } from "@nestjs/common"

describe('Users Controller', () => {
    let controller: UsersController
    let mockUsersService

    const mockUsers: User[] = [
        {
            id: '1',
            name: 'Mateo',
            password: '123456',
            email: 'mateo@email.com',
            phone: 123456789,
            country: "Colombia",
            isAdmin: false, 
            address: "Calle 123",
            city: "Medellin",
            orders: []
        },
        {
            id: '2',
            name: 'Andres',
            password: '123456',
            email: 'andres@email.com',
            phone: 123456789,
            country: "Colombia",
            isAdmin: false, 
            address: "Calle 123",
            city: "Medellin",
            orders: []
        }
    ]

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        getUsers: jest.fn().mockResolvedValue(mockUsers),
                        findUserById: jest.fn().mockResolvedValue(mockUsers[0]),
                        updateUser: jest.fn().mockResolvedValue('User Updated Successfully'),
                        deleteUser: jest.fn().mockImplementation((id: string) => Promise.resolve(id))
                    }
                },
                {
                    provide: AuthGuard,
                    useValue: {
                        canActivate: jest.fn().mockReturnValue(true)
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-token'),
                        verify: jest.fn().mockReturnValue({userId: 'mock-user-id'})
                    }
                }
            ]
        }).compile()

        controller = module.get<UsersController>(UsersController)
        mockUsersService = module.get<UsersService>(UsersService)
    })

    it('Controller must be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('getUsers', () => {
        it('It should return a users array', async () => {
            const result = await controller.getUsers()
            expect(result).toEqual(mockUsers)
            expect(mockUsersService.getUsers).toHaveBeenCalled()
            expect(mockUsersService.getUsers).toHaveBeenCalledTimes(1)
        })

        it('It should return an empty array if there are no users', async () => {
            mockUsersService.getUsers.mockResolvedValueOnce([]) 
            const result = await controller.getUsers()
            expect(result).toEqual([])
        })

        it('It should throw an error if the service fails', async () => {
            mockUsersService.getUsers.mockRejectedValueOnce(new Error('Database connection error'))
            await expect(controller.getUsers()).rejects.toThrow('Database connection error')
        })

        it('It should return users with correct properties', async () => {
            const result = await controller.getUsers()
            expect(result).toBeInstanceOf(Array)
            expect(result[0]).toHaveProperty('id')
            expect(result[0]).toHaveProperty('name')
            expect(result[0]).toHaveProperty('email')
            expect(result[0]).toHaveProperty('phone')
            expect(result[0]).toHaveProperty('country')
        })

        it('It should return at least one user if users exist', async () => {
            const result = await controller.getUsers()
            expect(result.length).toBeGreaterThan(0) 
        })
    })

    describe('findOne', () => {
        it('It should return a single user', async () => {
            const result = await controller.getUserById('1')
            expect(result).toEqual(mockUsers[0])
            expect(mockUsersService.findUserById).toHaveBeenCalledWith('1')
        });

        it('It should return undefined if user is not found', async () => {
            mockUsersService.findUserById.mockResolvedValue(undefined);
            const result = await controller.getUserById('999');
            expect(result).toBeUndefined();
            expect(mockUsersService.findUserById).toHaveBeenCalledWith('999')
        })

        it('It should return an error if service fails', async () => {
            mockUsersService.findUserById.mockRejectedValueOnce(new Error('Database error'))
            await expect(controller.getUserById('1')).rejects.toThrow('Database error')
        })

        it('It should return a user with the correct properties', async () => {
            const result = await controller.getUserById('1');

            expect(result).toHaveProperty('id', '1')
            expect(result).toHaveProperty('name', 'Mateo')
            expect(result).toHaveProperty('email', 'mateo@email.com')
            expect(result).toHaveProperty('phone', 123456789)
            expect(result).toHaveProperty('country', 'Colombia')
        })

        it('It should only call the services only once per request', async () => {
            await controller.getUserById('1')
            expect(mockUsersService.findUserById).toHaveBeenCalledTimes(1)
        })
    })

    describe('updateUser', () => {
        it('It should update a user and return a success message', async () => {
            const updatedUser: Partial<User> = {
                name: "Mateo Updated",
                email: 'mateo.updated@email.com',
                phone: 987654321
            }

            const result = await controller.updateUser('1', updatedUser);
            expect(result).toBe('User Updated Successfully');
            expect(mockUsersService.updateUser).toHaveBeenCalledWith('1', updatedUser);
            expect(mockUsersService.updateUser).toHaveBeenCalledTimes(1);
        })

        it('It should return an error message if user does not exists', async () => {
            mockUsersService.updateUser.mockResolvedValueOnce('User Not Found');
            const updatedUser: Partial<User> = { name: "Ghost User" };

            const result = await controller.updateUser('999', updatedUser)
            expect(result).toBe('User Not Found');
            expect(mockUsersService.updateUser).toHaveBeenCalledWith('999', updatedUser)
            expect(mockUsersService.updateUser).toHaveBeenCalledTimes(1);
        })

        it('It should throw an error if update fails', async () => {
            mockUsersService.updateUser.mockRejectedValueOnce(new Error('Database error'));
            const updatedUser: Partial<User> = { name: "Error Test" };
            await expect(controller.updateUser('1', updatedUser)).rejects.toThrow('Database error');
        })
        
    })

    describe('deleteUser', () => {
        it('It should delete a user from the array and return the id', async () => {
            const userToDelete = '1'
            const result = await controller.deleteUser(userToDelete);
            
            
            expect(result).toBe(userToDelete);
            expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userToDelete);
            expect(mockUsersService.deleteUser).toHaveBeenCalledTimes(1);
        })
    })
})