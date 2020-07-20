import { Controller, Post, Res, Body } from '@nestjs/common';
import { AuthentificationService } from './authentification.service'
import { Response } from 'express'
import { CreateUserDto } from './dto/create-user.dto';

@Controller('authentification')
export class AuthentificationController {
    constructor(private authentificationService: AuthentificationService) {}

    @Post('register')
    async register(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
        const user = await this.authentificationService.createUser(createUserDto)
        return res.status(201).json({
            message: 'User successfully created',
            token: 'the fucking token',
            user
        })
    }

}
