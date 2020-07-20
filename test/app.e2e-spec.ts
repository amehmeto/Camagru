import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Hello World!');
  });

  it('/authentification/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/authentification/register')
      .send({
        username: 'Johny',
        email: 'wesh@alors.fr',
        phone: '0612323454',
      })
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toMatchObject({
          message: 'User successfully created',
          token: 'the fucking token',
        })

        console.log(res.body)

        expect(res.body.user._id).toBeDefined()
        expect(res.body.user.created_at).toBeDefined()
        expect(res.body.user.__v).toBeDefined()
      })
  })

  it.skip('/authentification/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/authentification/users')
      .expect(HttpStatus.OK)
  })
});
