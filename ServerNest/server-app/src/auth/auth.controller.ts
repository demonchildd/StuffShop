import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, RegisterDto } from "./dto";
import { AtJwtGuard, RtJwtGuard } from "./guard";
import { GetUser, Public } from "./decorator";
import { Request } from "express";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    
    @Post('login')
    @Public()
    public login(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }

    
    @Post('register')
    @Public()
    register(@Body() dto: RegisterDto) {
        
        return this.authService.register(dto);
    }

    @Public()
    @Post('logout')
    logout(@Body() data){
        return this.authService.logout(data.id);
    }

    @Public()
    @UseGuards(RtJwtGuard)
    @Post('refresh')
    resreshTokens(@Req() req) {
        return this.authService.refreshTokens(req.user.id, req.user.refreshToken);
    }

}

