import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from './user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/types';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async createUser(addedUser: CreateUserDto): Promise<User | Message> {
        try {
            await this.checkCredentialsParamsAreUnique(addedUser)
            this.checkUserPasswordIsStrongEnough(addedUser)
            const salt = 10;
            const hashedPassword = await Bcrypt.hash(addedUser.password, salt)
            return await new this.userModel({ ...addedUser, password: hashedPassword, isActive: false }).save()
        } catch (e) {
            throw Error(e)
        }
    }

    private checkUserPasswordIsStrongEnough(addedUser: CreateUserDto) {
        if (addedUser.password.length < 8)
            throw Error('Password length has less than 8 characters')

        const STRONG_PASSWORD_PATTERN = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/
        if (!addedUser.password.match(STRONG_PASSWORD_PATTERN))
            throw Error('Password not strong enough')
    }

    private async checkCredentialsParamsAreUnique(addedUser: CreateUserDto) {
        const isUsernameAlreadyUsed = await this.userModel.exists({ username: addedUser.username })
        const isEmailAlreadyUsed = await this.userModel.exists({ email: addedUser.email })
        const isPhoneNumberAlreadyUsed = await this.userModel.exists({ phone: addedUser.phone })

        if (isEmailAlreadyUsed)
            throw Error('Email already used')
        if (isPhoneNumberAlreadyUsed)
            throw Error('Phone number already used')
        if (isUsernameAlreadyUsed)
            throw Error('Username already used')
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userModel.find().exec()
    }

    async getUserById(userId: string): Promise<User | null> {
        try {
            return await this.userModel.findById(userId)
        } catch(e) {
            throw Error(e)
        }
    }

    async updateUser(userId: string, createUserDto: CreateUserDto): Promise<User | null> {
        try {
            return await this.userModel.findByIdAndUpdate(userId, createUserDto, { new: true })
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteUser(userId: string): Promise<User | null> {
        try {
            return await this.userModel.findByIdAndRemove(userId)
        } catch (e) {
            throw new Error()
        }
    }
}
