import { IsEmail, IsNotEmpty, IsPhoneNumber, IsDefined, IsEmpty } from 'class-validator';

export class CreateUserDto {
    @IsDefined()
    @IsNotEmpty()
    readonly username: string

    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @IsDefined()
    @IsNotEmpty()
    @IsPhoneNumber('FR')
    readonly phone: string

    @IsDefined()
    @IsNotEmpty()
    readonly password: string

    @IsEmpty()
    readonly created_at: Date
}