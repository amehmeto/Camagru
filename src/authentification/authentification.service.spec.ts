import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationService } from './authentification.service';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthentificationModule } from './authentification.module';

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

  it('shoud insert a new user into the collection', async () => {
    const users = db.collection('users')

    const mockUser = { 
      _id: 'some-user-id',
      username: 'John',
      email: 'wesh@alors.fr',
      phone: '0612323454',
      created_at: new Date(),
    }
    const mockUser1 = { 
      username: 'Johny',
      email: 'wesh@alors.fr',
      phone: '0612323454',
      created_at: new Date(),
    }
    await service.createUser(mockUser1)

    await users.insertOne(mockUser)

    const insertedUser = await users.findOne({ _id: 'some-user-id' })
    expect(insertedUser).toEqual(mockUser)
    await users.deleteOne({ _id: 'some-user-id'})

    const insertedUser1 = await users.findOne({ username: 'Johny'}, {_id:0, __v: 0})
    expect(insertedUser1._id).toBeDefined()
    expect(insertedUser1.username).toEqual(mockUser1.username)
    expect(insertedUser1.email).toEqual(mockUser1.email)
    expect(insertedUser1.phone).toEqual(mockUser1.phone)
    expect(insertedUser1.created_at).toBeDefined()

    await users.deleteOne({ username: 'Johny'})
  })
});
