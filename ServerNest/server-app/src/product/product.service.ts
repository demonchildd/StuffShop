import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async getProducts() {
        return await this.prisma.products.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                image: true,
                description: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async getProductById(id: number) {
        const data = await this.prisma.products.findFirst({
            where : {
                id: id
            }
        });
        if(!data)
            throw new ForbiddenException('Not FOUND');
        return data;
    }

    async searchProductsByTitle(searchTitle: string) {
        const data = await this.prisma.products.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                image: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return data.filter(item => item.title.toLowerCase().includes(searchTitle.toLowerCase()));
    }


    async searchProductsByCategory(searchCategory: number, limit: number, offset: number) {
        const data = await this.prisma.products.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                image: true,
                categoryId: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    
        const res = data.filter((item) => item.categoryId == searchCategory);    
        const result = res.slice(offset, offset + limit);
        return result;
    }


    async searchProductsByFilter(searchCategory: number, searchTitle: string, price_min: number, price_max: number, limit: number, offset: number) {
        const data = await this.prisma.products.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                image: true,
                categoryId: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    
        let res = data.filter((item) => item.categoryId == searchCategory);    
        res = res.filter(item => item.title.toLowerCase().includes(searchTitle.toLowerCase()))
        res = res.filter(item => item.price > price_min);
        if(price_max != 0)
            res = res.filter(item => item.price < price_max);
        const result = res.slice(offset, offset + limit);
        return result;
    }

    async searchAllProducts(searchTitle: string, price_min: number, price_max: number, limit: number, offset: number) {
        const data = await this.prisma.products.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                image: true,
                categoryId: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        let res;
        res = data.filter(item => item.title.toLowerCase().includes(searchTitle.toLowerCase()));
        res = res.filter(item => item.price > price_min);
        if(price_max != 0)
            res = res.filter(item => item.price < price_max);
        const result = res.slice(offset, offset + limit);
        return result;
    }


    async addProduct(data: any, image: string) {
        try{
            await this.prisma.products.create({
                data: {
                    title: data.title,
                    description: data.description,
                    price: parseInt(data.price),
                    image: image,
                    categoryId: parseInt(data.categoryId)
                }
            })
            
        }
        catch(err) {
            console.log(err);
        }
        finally {
            return await this.prisma.products.findMany({
                select: {
                    id: true,
                    title: true,
                    price: true,
                    image: true,
                    description: true,
                    categories: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }
    }

    async updateProduct(data: any, image: string) {
        try{
            
            await this.prisma.products.updateMany({
                where: {
                    title: data.oldTitle
                },
                data: {
                    title: data.title,
                    description: data.description,
                    price: parseInt(data.price),
                    image: image,
                    categoryId: parseInt(data.categoryId)
                }
            })
            
        }
        catch(err) {
            console.log(err);
        }
        finally {
            return await this.prisma.products.findMany({
                select: {
                    id: true,
                    title: true,
                    price: true,
                    image: true,
                    description: true,
                    categories: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }
    }


    async deleteProduct(id: number) {
        try{
            await this.prisma.basket.deleteMany({
                where: {
                    productId: id
                }
            })
            await this.prisma.products.delete({
                where: {
                    id: id
                },
            })
            
        }
        catch(err) {
            console.log(err);
        }
        finally {
            return await this.prisma.products.findMany({
                select: {
                    id: true,
                    title: true,
                    price: true,
                    image: true,
                    description: true,
                    categories: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }
    }

    
}
