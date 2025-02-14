import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from '../app.service';
import { plainToInstance } from 'class-transformer';
import { User } from '../entity/user.entity';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly appService: AppService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.split(' ')[1];  // Format "Bearer <token>"

        try {
            const payload: { id: number } = this.jwtService.verify(token);
            console.log('Payload decoded from token:', payload);  // Log payload untuk verifikasi

            const user = await this.appService.auth(payload.id);
            console.log('User from auth service:', user);  // Log untuk memverifikasi user dari appService.auth()

            request.user = plainToInstance(User, user);  // Menyisipkan user ke dalam request

        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new UnauthorizedException('Invalid token');
        }

        return true;  // Request diizinkan
    }
}

