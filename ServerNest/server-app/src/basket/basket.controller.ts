import { Controller, ForbiddenException, Get, Post, Req } from '@nestjs/common';
import { BasketService } from './basket.service';
import { Request } from 'express';

@Controller('basket')
export class BasketController {
    constructor(private basketService: BasketService) {}

    @Get('basketById/:id')
    async getBasketById(@Req() req: Request) {
        if( /^\d+$/.test(req.params.id))
            return await this.basketService.getBasketById(parseInt(req.params.id));
        else
            throw new ForbiddenException('ID incorrect');
        
    }

    @Post("addItems")
    async addItems(@Req() req: Request) {
        if(req.body)
            return await this.basketService.addItems(req.body);
        else
            throw new ForbiddenException('ID incorrect');
    }
}
