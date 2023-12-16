import { Module, forwardRef } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { UsersModule } from 'src/users/users.module'
import { JwtStrategy } from './strategies/jwt.stategy'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './controllers/auth.controller'

//* External
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: 'jwt-cats',
            signOptions: {
                expiresIn: '15d',
            },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
