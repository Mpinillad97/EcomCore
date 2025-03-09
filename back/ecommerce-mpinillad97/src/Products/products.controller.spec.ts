import { Product } from "../entities/products.entity";
import { ProductsController } from "./products.controller"
import { Category } from "../entities/categories.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { AuthGuard } from "../guards/auth.guard";
import { JwtService } from "@nestjs/jwt";

describe('Products Controller', () => {
    let controller: ProductsController;
    let mockProductsService

    const mockProducts: Product[] = [
        {
            id: '1',
            name: 'Iphone 15 Pro Max',
            description: 'Celular Marca Apple',
            price: 15.99,
            stock: 12,
            imgUrl: 'http://imagestock.jpg',
            category: {
                id: '10',
                name: 'SmartPhone',
                products: []
            } as Category,
            orderDetails: []
        },
        {
            id: '2',
            name: '',
            description: 'Celular Marca Apple',
            price: 15.99,
            stock: 12,
            imgUrl: 'http://imagestock.jpg',
            category: {
                id: '10',
                name: 'SmartPhone',
                products: []
            } as Category,
            orderDetails: []
        }
    ]

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                {
                    
                    provide: ProductsService,
                    useValue: {
                        getProducts: jest.fn().mockResolvedValue(mockProducts),
                        getProductById: jest.fn().mockResolvedValue(mockProducts[0]),
                        createProduct: jest.fn().mockImplementation((product) => Promise.resolve({id: product.id})),
                        updateProduct: jest.fn().mockImplementation((id: string) => Promise.resolve({id: id})),
                        deleteProduct: jest.fn().mockImplementation((id: string) => Promise.resolve({id: id}))

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

        controller = module.get<ProductsController>(ProductsController)
        mockProductsService = module.get<ProductsService>(ProductsService)
    })
    it('Controller must be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('getProducts', () => {
        it('It should return a products array', async () => {
            const result = await controller.getProducts()
            expect(result).toEqual(mockProducts)
            expect(mockProductsService.getProducts).toHaveBeenCalled()
        })
    })

    describe('getOneProduct', () => {
        it('It should return a single product', async () => {
            const result = await controller.getProductById('1')

            expect(result).toEqual(mockProducts[0])
            expect(mockProductsService.getProductById).toHaveBeenCalledWith('1')
            expect(mockProductsService.getProductById).toHaveBeenCalledTimes(1)
        })

        it('It should return undefined if user is not found', async () => {
            mockProductsService.getProductById.mockResolvedValue(undefined);
            const result = await controller.getProductById('999')

            expect(result).toBeUndefined()
            expect(mockProductsService.getProductById).toHaveBeenCalledWith('999')
        })
    })

    describe('CreateProduct', () => {
        it('It should create a product and return the id', async () => {
            const newProduct: Product = {
                id: '3',
                name: 'Android Samsung Galaxy',
                description: 'Celular Marca Samsung',
                price: 20.99,
                stock: 12,
                imgUrl: 'http://imagestock.jpg',
                category: {
                    id: '10',
                    name: 'SmartPhone',
                    products: []
                } as Category,
                orderDetails: []
            }

            const result = await controller.createProduct(newProduct)

            expect(result).toEqual({id: '3'})
            expect(mockProductsService.createProduct).toHaveBeenCalledWith(newProduct)
            expect(mockProductsService.createProduct).toHaveBeenCalledTimes(1)
        })

        it('should throw an error if product name is missing', async () => {
            const incompleteProduct: Partial<Product> = {
                id: '4',
                description: 'Celular sin nombre',
                price: 10.99,
                stock: 5,
                imgUrl: 'http://imagestock.jpg',
                category: {
                    id: '10',
                    name: 'SmartPhone',
                    products: []
                } as Category,
                orderDetails: []
            };
        
            mockProductsService.createProduct.mockRejectedValue(new Error('Product name is required'));
        
            await expect(controller.createProduct(incompleteProduct as Product)).rejects.toThrow('Product name is required');
            expect(mockProductsService.createProduct).toHaveBeenCalledWith(incompleteProduct);
        });
        
    })

    describe('updateProduct', () => {
        it('It should update a product and return the id of the product', async () => {
            const updatedProduct: Partial<Product> = {
                name: 'Android Samsung Galaxy 2',
                description: 'Updated Android',
                price: 99.99
            }

            const result = await controller.updateProduct('2', updatedProduct);

            expect(result).toEqual({id: mockProducts[1].id})
            expect(mockProductsService.updateProduct).toHaveBeenCalledWith("2", updatedProduct);
            expect(mockProductsService.updateProduct).toHaveBeenCalledTimes(1)
        })
    })

    describe('deleteProduct', () => {
        it('It should delete a product from the array list and return the id of the deleted product', async () => {
            const productToDelete = '1';

            const result = await controller.deleteProduct(productToDelete);

            expect(result).toEqual({id: mockProducts[0].id})
            expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(productToDelete);
            expect(mockProductsService.deleteProduct).toHaveBeenCalledTimes(1)            
        })
    })
    
})