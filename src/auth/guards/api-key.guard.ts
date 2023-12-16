import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Inject,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigType } from '@nestjs/config'
import { Observable } from 'rxjs'

import { IS_PUBLIC_KEY } from '../decorator/public.decorator'

import { Request } from 'express'

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler())
        if (isPublic) {
            return true
        }
        const request = context.switchToHttp().getRequest<Request>()
        const authHeader = request.header('Auth')
        const isAuth = authHeader === ''
        if (!isAuth) {
            throw new UnauthorizedException('not allow')
        }
        return isAuth
    }
}
