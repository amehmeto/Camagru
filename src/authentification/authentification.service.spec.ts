import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationService } from './authentification.service';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthentificationModule } from './authentification.module';
import { JwtModule } from '@nestjs/jwt';
import * as JwtDecode from 'jwt-decode';
import { jwtConstants } from './constants';
import { UserService } from '../../src/user/user.service';
import { User } from 'src/user/user.interface';

describe('AuthentificationService', () => {
  let service: AuthentificationService;
  let userService: UserService;
  let db: any;
  let module: TestingModule;
  let connection: MongoClient;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost/camagru', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('camagru');
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot("mongodb://localhost/camagru"),
        AuthentificationModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "60s" }
        })
      ],
      providers: [AuthentificationService, UserService]
    }).compile();

    service = module.get<AuthentificationService>(AuthentificationService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await db.collection('users').deleteOne({ username: 'Johny' })
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate an email validation JWT token', async () => {
    const dumbUser = await userService.createUser({
      username: "Johny",
      email: "wesh@alors.fr",
      phone: "0611223344",
      password: "T0pS3cr3t$",
      created_at: new Date()
    });
    const generatedToken = service.generateEmailValidationToken(dumbUser)
    const decodedToken = JwtDecode(generatedToken);
    expect(decodedToken).toMatchObject({ username: 'Johny' });
  });

  it.skip('shoud insert a new user into the collection', async () => {
    const users = db.collection('users');

    const mockUser = {
      username: 'Johny',
      email: 'wesh@alors.fr',
      password: 'TOPSECRET',
      phone: '0612323454',
      created_at: new Date(),
    };

    const insertedUser = await users.findOne({ username: 'Johny' });
    expect(insertedUser._id).toBeDefined();
    expect(insertedUser.username).toEqual(mockUser.username);
    expect(insertedUser.email).toEqual(mockUser.email);
    expect(insertedUser.password).toEqual(mockUser.password);
    expect(insertedUser.phone).toEqual(mockUser.phone);
    expect(insertedUser.created_at).toBeDefined();

    await users.deleteOne({ username: 'Johny' });
  })

  it('should activate user in DB when token is right', async () => {
    const dumbUser = await userService.createUser({
      username: "Johny",
      email: "wesh@alors.fr",
      phone: "0611223344",
      password: "T0pS3cr3t$",
      created_at: new Date()
    })

    const token = service.generateEmailValidationToken(dumbUser)
    service.verifyAccountCreation(token)
    const user = await userService.getUserById(dumbUser._id)
    expect(user?.isActive).toBeTruthy
  })
});
