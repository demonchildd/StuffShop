import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, RegisterDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Tokens } from "./types";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ){}

    async login(dto: AuthDto){
        const user = await this.prisma.users.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user)
            throw new ForbiddenException('Credentials incorrect');
    
        const check = await argon.verify(user.password, dto.password);
        
        if(!check)
            throw new ForbiddenException('Credentials incorrect');

        const tokens = await this.signToken(user.id, user.email, user.role);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens

    }

    

    async register(dto: RegisterDto) {
        
        const hash = await argon.hash(dto.password);
        try{
            const user = await this.prisma.users.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: hash,
                    role: 'User'
                }
            })
            delete user.password
            const tokens = await this.signToken(user.id, user.email, user.role);
            await this.updateRtHash(user.id, tokens.refresh_token);
            return tokens;
        }
        catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002')
                    throw new ForbiddenException('Credintials taken');
            }
            throw error
        }
    }

    async logout(userId: number) {
        await this.prisma.users.updateMany({
            where: {
                id: userId,
                hashRt: {
                    not: null
                }
            },
            data: {
                hashRt: null
            }
        })
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.users.findUnique({
            where: {
                id: userId
            }

        })
        if(!user || !user.hashRt)
            throw new ForbiddenException('Refresh token incorrect');
        const check = await argon.verify(user.hashRt, rt);
        if(!check)
            throw new ForbiddenException('Refresh token incorrect');
        const tokens = await this.signToken(user.id, user.email, user.role);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens
    }    

    async signToken(
        userId: number, 
        userEmail: string, 
        userRole: string
    ): Promise<Tokens> {
        const payload = {
            id: userId,
            email: userEmail,
            role: userRole
        }
        const [at, rt] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '3h',
                secret: this.config.get('ATJWT_SECRET')
            }),
            this.jwt.signAsync(payload, {
                expiresIn: '7d',
                secret: this.config.get('RTJWT_SECRET')
            }),

        ])
        

        return {
            access_token: at,
            refresh_token: rt 
        };
        
    }


    async updateRtHash(userId: number, refresh_token: string) {
        const hash = await argon.hash(refresh_token);
        await this.prisma.users.update({
            where: {
                id: userId
            },
            data: {
                hashRt: hash
            }
        })
    }

    

}