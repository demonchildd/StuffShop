import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BasketService {
    constructor(private prisma: PrismaService) {}

    async getBasketById(id: number) {
        const data = await this.prisma.basket.findMany({
            where: {
                userId: id
            },
            select: {
                quantity: true,
                products: {
                    select: {
                        id: true,
                        title: true,
                        categoryId: true,
                        description: true,
                        image: true,
                        price: true
                    }
                }
            }
        });

        return data;
    }


    async addItems(data: any) {
       
        await this.prisma.basket.deleteMany({
            where: {
                userId: data.id
            }
        })
        if(data.items) {
            data.items.forEach(async element => {
                await this.prisma.basket.create({
                    data: {
                        userId: data.id,
                        productId: element.id,
                        quantity: element.quantity
                    }
                })
            });
        }   

        return "OK";
        
    }
}
