import { Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { AuthService } from 'src/auth/services/auth.service'
import { User } from 'src/users/entities/user.entity'

@Controller('auth')
export class AuthController {
    constructor(private Au: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('sing-in')
    login(@Req() req: Request) {
        const user = req.user as User
        return this.Au.generateJWT(user)
    }
}
