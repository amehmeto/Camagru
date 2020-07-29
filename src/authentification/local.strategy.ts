import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from "passport-local";
import { AuthentificationService } from "./authentification.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthentificationService) {
        super()
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password)
        if (!user)
            throw new UnauthorizedException()
        return user
    }
}