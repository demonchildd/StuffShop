import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService
    ){}

    async getCategories() {
        return await this.prisma.categories.findMany();
    }
}
