import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class RtJwtStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor(private config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('RTJWT_SECRET'),
            passReqToCallback: true,
        }) ;
    }
    async validate(req: Request, payload: {
        id: number,
        email: string,
        role: string
    }) {
        const user = await this.prisma.users.findUnique({
            where: {
                id: payload.id
            }
        })
        delete user.password
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        return {
            ...user,
            refreshToken
        };
    }
}