import {
    Body,
    ConflictException,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthService } from 'src/auth/services/auth.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private Au: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('sing-in')
    login(@Req() req: Request) {
        const user = req.user as User
        return this.Au.generateJWT(user)
    }

    @Post('sign-up')
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.Au.createUser(createUserDto)
        } catch (error) {
            if (error.code === 11000) {
                this.ConflictMessages(error)
            }
        }
    }

    //*Functions
    private ConflictMessages(error: any) {
        if (error.keyPattern.email) {
            throw new ConflictException('Este Email ya esta registrado')
        }
        if (error.keyPattern.cellphone) {
            throw new ConflictException('Este numero ya esta registrado')
        }
    }
}
