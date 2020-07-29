import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.interface';
import { JwtService } from '@nestjs/jwt'
import * as Bcrypt from 'bcrypt'

@Injectable()
export class AuthentificationService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, passwordAttempt: string): Promise<any> {
        const retrievedUser = await this.userModel.findOne({ username })
        if (retrievedUser && await this.isPasswordCorrect(passwordAttempt, retrievedUser)) {
            const { password, ...result } = retrievedUser
            return result
        }
        return null
    }

    private isPasswordCorrect(passwordAttempt: string, retrievedUser: User) {
        return Bcrypt.compare(passwordAttempt, retrievedUser.password);
    }

    async generateJwtToken(user: any) {
        const payload = { username: user._doc.username, sub: user._doc._id }
        return this.jwtService.sign(payload);
    }

    generateEmailValidationToken(username: string): string {
        
        return ''
    }
}
