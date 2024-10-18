import { Controller, ForbiddenException, Get, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Public } from 'src/auth/decorator';
import { Request } from 'express';
import { MailService } from './mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('order')
export class OrderController {

    codes = new Array<string>();

    constructor(
        private orderService: OrderService,
        private mailService: MailService,
        private prisma: PrismaService
    ) {}


    
    @Post("send")
    send(@Req() req: Request) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        this.codes.push(result);
        this.mailService.sendConfirmationCode(req.body.user.email, result);
    }

    @Get("orderById/:id")
    async getOrder(@Req() req: Request) {
        return await this.prisma.orders.findMany({
            where: {
                userId: parseInt(req.params.id)
            }
        })
    }

    
    @Post("confirm")
    async confirm(@Req() req: Request) {
        let check = false;
        this.codes.forEach(el => {
            if(this.codes == req.body.code)
                check = true;
        })
        console.log(req.body);
        if(check) {
            let sum = 0;
            let d = new Date();
            req.body.basket.forEach((item) => {
                sum += item.quantity * item.price;
            })

            const data = await this.prisma.orders.create({
                data: {
                    userId: req.body.id,
                    count_product: req.body.basket.length,
                    total_price: sum,
                    order_date: d,
                    confirm: "Confirm"


                }
            })

            return data;
        }
        else {
            throw new ForbiddenException('Error');
        }
        
    }
}
