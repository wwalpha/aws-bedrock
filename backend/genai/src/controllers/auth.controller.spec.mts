// import request from 'supertest';
// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';

// describe('UserController', () => {
//   let app: INestApplication;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   it('should return message for signin', async () => {
//     const response = await request(app.getHttpServer())
//       .post('/user/signin')
//       .send();

//     expect(response.status).toBe(201);
//     expect(response.body).toEqual({ message: 'Get user profile' });
//   });

//   it('should return message for signup', async () => {
//     const response = await request(app.getHttpServer())
//       .post('/user/signup')
//       .send();

//     expect(response.status).toBe(201);
//     expect(response.body).toEqual({ message: 'Get user profile' });
//   });
// });
