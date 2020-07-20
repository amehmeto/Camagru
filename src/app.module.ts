import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthentificationController } from './authentification/authentification.controller';
import { AuthentificationModule } from './authentification/authentification.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    AuthentificationModule,
    MongooseModule.forRoot('mongodb://localhost/')
  ],
  controllers: [AppController, AuthentificationController],
  providers: [AppService],
})
export class AppModule {}
