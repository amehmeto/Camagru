import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module'

describe('UserService', () => {
  let service: UserService;
  let db: any;
  let module: TestingModule;
  let connection: MongoClient;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost/camagru', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = connection.db('camagru')
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/camagru'),
        UserModule,
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });
  
  afterEach(async () => {
    module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('shoud insert a new user into the collection', async () => {
    const users = db.collection('users')

    const mockUser = { 
      username: 'Johny',
      email: 'wesh@alors.fr',
      password: 'TOPSECRET',
      phone: '0612323454',
      created_at: new Date(),
    }
    await service.createUser(mockUser)

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
