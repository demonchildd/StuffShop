import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AtJwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {
    constructor(private config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('ATJWT_SECRET'),
        }) ;
    }


    async validate(payload: {
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
        return user;
    }
}
