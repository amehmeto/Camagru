import { 
    BadRequestException, Body, Controller,  Delete, HttpStatus, Get,
    NotFoundException, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express'
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.interface';
import { JwtAuthGuard } from '../authentification/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createUser(
        @Res() res: Response,
        @Body() createUserDto: CreateUserDto
        ): Promise<Response> {
        const user = await this.userService.createUser(createUserDto)
        return res.status(HttpStatus.CREATED).json(user)
    }

    @Get()
    async getAllUsers(@Res() res: Response){
        const users = await this.userService.getAllUsers()
        return res.status(HttpStatus.OK).json(users)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getUserById(@Res() res: Response, @Param('userId') userId: string){
        let user: User | null
        try {
            user = await this.userService.getUserById(userId)
        } catch (e) {
            throw new BadRequestException('Invalid user ID')
        }
        if (!user)
            throw new NotFoundException('User not found')
        return res.status(HttpStatus.OK).json(user)
    }

    @Put(':userId')
    async updateUser(@Res() res: Response, @Param('userId') userId: string, @Body() createUserDto: CreateUserDto){
        let user: User | null
        try {
            user = await this.userService.updateUser(userId, createUserDto)
        } catch (e) {
            throw new BadRequestException('User ID invalid')
        }
        return res.status(HttpStatus.OK).json(user)
    }

    @Delete(':userId')
    async deleteUser(@Res() res: Response, @Param('userId') userId: string){
        let user: User | null
        try {
            user = await this.userService.deleteUser(userId)
        } catch (e) {
            throw new BadRequestException('User ID invalid')
        }
        return res.status(HttpStatus.OK).json(user)
    }
}
