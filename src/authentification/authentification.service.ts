import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.interface';
import { JwtService } from '@nestjs/jwt'
import * as Bcrypt from 'bcrypt'
import * as colors from 'colors/safe'
import * as jwtDecode from 'jwt-decode';

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

    generateJwtToken(user: any) {
        const payload = { username: user.username, sub: user._id }
        return this.jwtService.sign(payload);
    }

    generateEmailValidationToken(user: User): string {
        const payload = { username: user.username, sub: user._id }
        const jwtSignOptions = { expiresIn: '30s' }
        return this.jwtService.sign(payload, jwtSignOptions)
    }

    sendEmailConfirmation(token: string) {
        console.log(colors.green('Veuillez confirmer votre compte en visitant le lien suivant :'))
        console.log(colors.green('authentification/verify/' + token))
    }

    verifyAccountCreation(token: string) {
        const decodedToken: any = jwtDecode(token)
        let user: any
        if (this.isTokenStillNotExpired(decodedToken))
            user = this.userModel.findOneAndUpdate({ username: decodedToken.username }, { isActive: true} )
        else 
            console.error('EXPIRED')
    }

    isTokenStillNotExpired(decodedToken: any) {
        return (decodedToken.exp < Date.now())
    }
}
