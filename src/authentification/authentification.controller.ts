import { Controller, Post, Res, Request, Body, UseGuards, Get, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '..//user/user.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthentificationService } from './authentification.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('authentification')
export class AuthentificationController {
    constructor(
        private userService: UserService,
        private authService: AuthentificationService
    ) { }

    @Post('register')
    async register( @Res() res: Response, @Body() createUserDto: CreateUserDto
    ) {
        try {
            const user = await this.userService.createUser(createUserDto)
            const emailValidationToken = this.authService.generateEmailValidationToken(user)
            this.authService.sendEmailConfirmation(emailValidationToken)
            return res.status(HttpStatus.CREATED).json({
                token: this.authService.generateJwtToken(user)
            })
        } catch (e) {
            console.error(e)
            return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message })
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return {
            token: this.authService.generateJwtToken(req.user._doc)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user
    }

    @Get('verify/:jwtToken')
    verifyUserAccountCreation(@Res() res: Response) {
        return res.status(HttpStatus.OK).json({ message: 'User account now active'})
    }
}
