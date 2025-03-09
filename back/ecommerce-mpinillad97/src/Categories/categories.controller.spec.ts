import { Category } from "src/entities/categories.entity"
import { CategoriesController } from "./categories.controller"
import { Test, TestingModule } from "@nestjs/testing"
import { CategoriesService } from "./categories.service"

describe('Categories Controller', () => {
    let controller: CategoriesController
    let mockCategoriesService

    const mockCategories: Partial<Category>[] = [
        {
            "id": "1",
            "name": "Smartphone"
        },
        {
            "id": "2",
            "name": "monitor"
        }
    ]

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoriesController],
            providers: [
                {
                    provide: CategoriesService,
                    useValue: {
                        getCategories: jest.fn().mockResolvedValue(mockCategories)
                    }
                }
            ]
        }).compile()

        controller = module.get<CategoriesController>(CategoriesController)
        mockCategoriesService = module.get<CategoriesService>(CategoriesService)
    })

    it('Controller must be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('getCategories', () => {

        it('It should return a Categories array', async () => {
            const result = await controller.getCategories()
            expect(result).toEqual(mockCategories)
            expect(mockCategoriesService.getCategories).toHaveBeenCalled()
            expect(mockCategoriesService.getCategories).toHaveBeenCalledTimes(1)
            expect(result).toBeInstanceOf(Array)
        })

        it('It should throw an error if the service fails', async () => {
            mockCategoriesService.getCategories.mockRejectedValueOnce(new Error('Database connection error'))
            await expect(controller.getCategories()).rejects.toThrow('Database connection error');
        })

        it('It should return an empty array if there are no Categories', async () => {
                mockCategoriesService.getCategories.mockResolvedValueOnce([])
                const result = await controller.getCategories()
                expect(result).toEqual([])
        })

        it('It should return Categories with the correct properties', async () => {
            const result = await controller.getCategories()
            expect(result).toBeInstanceOf(Array)
            expect(result[0]).toHaveProperty('id')
            expect(result[0]).toHaveProperty('name')
            
        })

        it('It should return at least one category if it exists', async () => {
            const result = await controller.getCategories()
            expect(result.length).toBeGreaterThan(0)
        })


    })
})