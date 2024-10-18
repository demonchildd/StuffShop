import { Controller, Get, UseGuards } from '@nestjs/common';
import { users } from '@prisma/client';
import { GetUser, Public } from 'src/auth/decorator';

import { AtJwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    
    
    @Get('profile')
    getProfile(@GetUser() user: users) {
        return user;
    }
}
