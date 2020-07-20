import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationController } from './authentification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthentificationModule } from './authentification.module';
import { AuthentificationService } from './authentification.service';

describe('Authentification Controller', () => {
  let controller: AuthentificationController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/camagru'),
        AuthentificationModule,
      ],
    providers: [AuthentificationService],
  }).compile();

    controller = module.get<AuthentificationController>(AuthentificationController);
  });

  afterEach(async () => {
    module.close();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
