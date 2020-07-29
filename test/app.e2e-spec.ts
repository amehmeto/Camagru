import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoClient } from 'mongodb'
import * as JwtDecode from 'jwt-decode';
import { AuthentificationService } from '../src/authentification/authentification.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../src/authentification/constants';
import { UserModule } from '../src/user/user.module';
import { AuthentificationModule } from '../src/authentification/authentification.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let db: any
  let connection: MongoClient;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost/camagru', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = connection.db('camagru')
  });


  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        AuthentificationModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
        UserModule
      ],
      providers: [AuthentificationService]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    //await db.collection('users').deleteMany({})
    await db.collection('users').deleteOne({ username: 'Johny' })
    app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Hello World!');
  });

  describe('Authentification', () => {

    it('/authentification/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/authentification/register')
        .send({
          username: 'Johny',
          email: 'wesh@alors.fr',
          phone: '0612323454',
          password: 'Str0ngP@$$w0rd',
        })
        .expect(HttpStatus.CREATED)
        .expect('Content-Type', /json/)
        .expect((res) => {
          const payload = JwtDecode(res.body.token)
          expect(payload).toMatchObject({ username: 'Johny' }) 
        })
    })

    it('should refuse to create a user if the password isn\'t strong enough', () => {
      return request(app.getHttpServer())
        .post('/authentification/register')
        .send({
          username: 'Johny',
          email: 'wesh@alors.fr',
          phone: '0612323454',
          password: 'TOPSECRET',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect('Content-Type', /json/)
        .expect({
          message: 'Error: Password not strong enough'
        })
    })

    it('should successfully return a JWT token', async () => {
      return request(app.getHttpServer())
        .post('/authentification/login')
        .send({
          username: 'Jaja',
          password: 'T0pS3cr3t$',
        })
        .expect(HttpStatus.CREATED)
        .expect('Content-Type', /json/)
        .expect((res) => {
          const payload = JwtDecode(res.body.token)
          expect(payload).toMatchObject({ username: 'Jaja', sub: '5f206b479b943445ad2981e1'})
        })
    })

    it('should reject unauthorized due to wrong password', async () => {
      return request(app.getHttpServer())
        .post('/authentification/login')
        .send({
          username: 'Jaja',
          password: 'nimportequoi',
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' })
    })

  })

  describe('Users CRUD', () => {
    it.skip('users (GET)', async () => {
      const dummyUsers = [
        {
          _id: "niquesamere",
          username: "LIM",
          email: "wesh@alors.fr",
          phone: "0612323454",
          password: "TOPSECRET",
          created_at: (new Date()).toISOString(),
          __v: 0
        },
        {
          _id: "laputaindesareace",
          username: "SALIF",
          email: "wesh@alors.fr",
          phone: "0612323454",
          password: "TOPSECRET",
          created_at: (new Date()).toISOString(),
          __v: 0
        }
      ]
      await db.collection('users').insertMany(dummyUsers)

      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK)
        .expect(async (res) => expect(res.body).toMatchObject(dummyUsers))
    })
    it.skip('users/:id (GET)', () => { })
    it.skip('users/ (POST)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'Johny',
          email: 'wesh@alors.fr',
          phone: '0612323454',
          password: 'TOPSECRET'
        })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body._id).toBeDefined()
          expect(res.body.created_at).toBeDefined()
          expect(res.body).toMatchObject({
            username: 'Johny',
          email: 'wesh@alors.fr',
          phone: '0612323454',
          password: 'TOPSECRET',
          })
        })
    })
    it.skip('users/:id (DELETE)', () => { })
    it.skip('users/ (PUT)', () => { })
  })

});
