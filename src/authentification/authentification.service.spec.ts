import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationService } from './authentification.service';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthentificationModule } from './authentification.module';
import { JwtModule } from '@nestjs/jwt';
import JwtDecode from 'jwt-decode'
import { jwtConstants } from './constants';

describe('AuthentificationService', () => {
  let service: AuthentificationService;
  let db: any;
  let module: TestingModule ;
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
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/camagru'),
        AuthentificationModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthentificationService],
    }).compile();

    service = module.get<AuthentificationService>(AuthentificationService);
  });

  afterEach(async () => {
    module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate an email validation JWT token', () => {
    const generatedToken = service.generateEmailValidationToken('Arthur')
    const decodedToken = JwtDecode(generatedToken)
    expect(decodedToken).toMatchObject({ username: 'Arthur' })
  })

  it.skip('shoud insert a new user into the collection', async () => {
    const users = db.collection('users')

    const mockUser = { 
      username: 'Johny',
      email: 'wesh@alors.fr',
      password: 'TOPSECRET',
      phone: '0612323454',
      created_at: new Date(),
    }

    const insertedUser = await users.findOne({ username: 'Johny'})
    expect(insertedUser._id).toBeDefined()
    expect(insertedUser.username).toEqual(mockUser.username)
    expect(insertedUser.email).toEqual(mockUser.email)
    expect(insertedUser.password).toEqual(mockUser.password)
    expect(insertedUser.phone).toEqual(mockUser.phone)
    expect(insertedUser.created_at).toBeDefined()

    await users.deleteOne({ username: 'Johny'})
  })
});
