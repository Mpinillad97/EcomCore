import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { UsersRepository } from '../src/Users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { ProductsRepository } from '../src/Products/products.repository';
import { OrdersRepository } from '../src/Orders/orders.repository';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mockUsersRepository: Partial<UsersRepository>
  let mockProductsRepository: Partial<ProductsRepository>
  let mockOrdersRepository: Partial<OrdersRepository>
  let jwtService: JwtService
  let token: string;


  const testUsers =
    {
      id: uuidv4(),
      name: 'TestUser',
      email: 'test@email.com',
      address: 'Calle 123',
      password: 'pass1234',
      phone: 123456,
      country: 'Colombia',
      city: 'Medellin',
      isAdmin: true
    }

  const testProduct = {
      id: uuidv4(), 
      name: "Laptop",
      description: "A powerful laptop",
      price: 1200,
      stock: 10,
      category: { name: "Electronics" } 
  };

  const testOrder = {
    id: uuidv4(),
    userId: testUsers.id,
    products: [
      { productId: 'test-product-id', quantity: 2, price: 1200 }
    ],
    totalPrice: 2400,
    createdAt: new Date().toISOString(),
  };
  
  


  beforeEach(async () => {
    mockUsersRepository = {
      findByEmail: jest.fn().mockImplementation((email) => {
        return email === testUsers.email ? testUsers : null;
      }),
      createUser: jest.fn().mockImplementation((userData) => {
        return { id: 'mockId', ...userData }; 
      }),
      getUserById: jest.fn().mockResolvedValue(testUsers),
      getUsers: jest.fn().mockResolvedValue([testUsers]),
      updateUser: jest.fn().mockImplementation((id, userData) => {
        return Promise.resolve({...testUsers, ...userData})
      }),
      deleteUser: jest.fn().mockImplementation((id) => {
        return Promise.resolve({id})
      })
    }
    mockProductsRepository = {
      getProducts: jest.fn().mockResolvedValue([testProduct]),
      getProductById: jest.fn().mockResolvedValue(testProduct),
      createProduct: jest.fn().mockImplementation((productData) => {
        return Promise.resolve({ id: 'mockId', ...productData });
      }),
      updateProduct: jest.fn().mockImplementation((id, productData) => {
        return Promise.resolve({...testProduct, ...productData})
      }),
      deleteProduct: jest.fn().mockImplementation((id) => {
        return Promise.resolve({id})
      })
    }
    mockOrdersRepository = {
      getOrder: jest.fn().mockResolvedValue(testOrder)
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(UsersRepository).useValue(mockUsersRepository).overrideProvider(ProductsRepository).useValue(mockProductsRepository).overrideProvider(OrdersRepository).useValue(mockOrdersRepository).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    jwtService = moduleFixture.get<JwtService>(JwtService)
    jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash) => {
      return Promise.resolve(password === 'pass1234')
    })
    const payload = { id: testUsers.id, email: testUsers.email, isAdmin: testUsers.isAdmin };
    token = jwtService.sign(payload);
  })

  it('(POST) in the route /auth/signin should authenticate the user and return a token', () => {
    return request(app.getHttpServer())
    .post('/auth/signin')
    .send({email: 'test@email.com', password: 'pass1234'})
    .expect((res) => {
      expect(res.body).toHaveProperty('token')
      expect(res.body.token).toBeDefined()
    })
  }),

  it('(POST) in the route /auth/signUp should create a user and return it without sensitive data', () => {
    return request(app.getHttpServer())
    .post('/auth/signUp')
    .send({email: 'mock123@email.com', password: 'Pass123!', confirmPassword: 'Pass123!', phone: 123456789, name: 'test2'})
    .expect((res) => {
      expect(res.body).toHaveProperty('name')
      expect(res.body).not.toHaveProperty('password')
      expect(res.body).toHaveProperty('email')
    })
  })

  it('(GET) in the route /users/:id should return a user', () => {
    return request(app.getHttpServer())
      .get(`/users/${testUsers.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('name', testUsers.name)
        expect(res.body).toHaveProperty('email', testUsers.email)
      });
  });

  it('(PUT) in the route /users/:id should update a user', () => {
    const updatedUser = {
      name: 'UpdatedTestUser',
      email: 'updated@email.com',
      address: 'New Address 456',
      phone: 987654,
      country: 'Argentina',
      city: 'Buenos Aires'
    }
    return request(app.getHttpServer())
    .put(`/users/${testUsers.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedUser)
    .expect((res) => {
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty('name', updatedUser.name)
      expect(res.body).toHaveProperty('email', updatedUser.email)
    }) 
  })

  it('(DELETE) in the route /users/:id should delete a user and return the id', () => {
    return request(app.getHttpServer())
    .delete(`/users/${testUsers.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual({id: testUsers.id})
      expect(res.body).not.toHaveProperty('email')
      expect(res.body).not.toHaveProperty('name')
      expect(res.body).toHaveProperty('id', testUsers.id)
    })
  })

  it('(GET) in the route /products should return a products array', () => {
    return request(app.getHttpServer())
    .get(`/products`)
    .expect((res) => {
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.length).toBeGreaterThan(0)
    })
  })

  it('(GET) in the route /products/:id should return a single product', () => {
    return request(app.getHttpServer())
    .get(`/products/65bcecdf-f158-4bfc-bfe1-bff77dc4ca70`)
    .expect((res) => {
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('price')
    })
  })

  it('(PUT) in the route /products/:id should update a product', () => {
    const updatedProduct = {
      name: 'updated Product',
      price: 1000
    }
    return request(app.getHttpServer())
    .put(`/products/${testProduct.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedProduct)
    .expect((res) => {
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty('name', 'updated Product')
      expect(res.body).toHaveProperty('price', 1000)
    })
  })

  it('(DELETE) in the route /products/:id should delete a product and return an id', () => {
    return request(app.getHttpServer())
    .delete(`/products/${testProduct.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect((res) => {
      expect(res.body).toEqual({id: testProduct.id})
      expect(res.body).not.toHaveProperty('name')
      expect(res.body).not.toHaveProperty('price')
      expect(res.body).toHaveProperty('id', testProduct.id)
    })
  })

  it('(GET) in the route /orders/:id should return a single order', () => {
    return request(app.getHttpServer())
    .get(`/orders/${testOrder.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect((res) => {
      expect(res.body).toEqual(testOrder)
      expect(res.body).toBeInstanceOf(Object)
    })
  })
  

  afterAll(async () => {
    await app.close()
  })
})
