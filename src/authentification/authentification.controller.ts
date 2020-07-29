import { Controller, Post, Res, Request, Body, UseGuards, Get, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '..//user/user.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthentificationService } from './authentification.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { hash } from 'bcrypt';

@Controller('authentification')
export class AuthentificationController {
    constructor(
        private userService: UserService,
        private authService: AuthentificationService
    ) { }

    @Post('register')
    async register( @Res() res: Response, @Request() req: any, @Body() createUserDto: CreateUserDto
    ) {
        try {
            const user = await this.userService.createUser(createUserDto)
            const emailValidationToken = this.authService.generateEmailValidationToken(createUserDto.username)
            return res.status(HttpStatus.CREATED).json({
                token: await this.authService.generateJwtToken(user)
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
            token: await this.authService.generateJwtToken(req.user)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user
    }
}
