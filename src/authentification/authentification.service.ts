import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.interface';

@Injectable()
export class AuthentificationService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async createUser(addedUser: Object): Promise<User> {
        const user = await new this.userModel(addedUser).save()
        return user
    }

    /**
    async getAllUsers(): Promise<User[]> {
        return await this.userModel.find().exec()
    }
    */
}
