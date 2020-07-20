import { Module } from '@nestjs/common';
import { AuthentificationController } from './authentification.controller';
import { AuthentificationService } from './authentification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
    ],
    controllers: [AuthentificationController],
    providers: [AuthentificationService],
    exports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        AuthentificationService
    ]   
})
export class AuthentificationModule {}
