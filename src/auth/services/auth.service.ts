import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { User } from 'src/users/entities/user.entity'
import { payloadToken } from 'src/auth/models/token.mode'

//* External
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)
        if (!user) {
            return null
        }
        const isMach = await bcrypt.compare(password, user.password)
        if (isMach) {
            const { password, ...rta } = user.toJSON()
            return rta
        }

        return null
    }

    generateJWT(user: User) {
        const payload: payloadToken = { sub: user.email }
        return {
            access_token: this.jwtService.sign(payload),
            user,
        }
    }

    async createUser(createUserDto: CreateUserDto) {
        const newUser = await this.userService.create(createUserDto)
        return this.generateJWT(newUser)
    }
}
