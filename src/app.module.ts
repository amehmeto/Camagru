import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthentificationController } from './authentification/authentification.controller';
import { AuthentificationModule } from './authentification/authentification.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    AuthentificationModule,
    MongooseModule.forRoot('mongodb://localhost/camagru'),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AppController, AuthentificationController],
  providers: [AppService],
})
export class AppModule {}
