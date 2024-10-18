import { Body, Controller, Delete, ForbiddenException, Get, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetUser, Public } from 'src/auth/decorator';
import { Request } from 'express';
import { FilesService } from 'src/files/files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService,
        private filesService: FilesService
    ) {}

    @Public()
    @Get('all')
    async getProducts() {
        return await this.productService.getProducts();
    }

    @Public()
    @Get('productById/:id')
    async getProductById(@Req() req : Request) {
        if( /^\d+$/.test(req.params.id))
            return await this.productService.getProductById(parseInt(req.params.id));
        else
            throw new ForbiddenException('ID incorrect');


        
    }

    
    @Delete('deleteProduct/:id')
    async delete(@Req() req : Request) {
        if( /^\d+$/.test(req.params.id))
            return await this.productService.deleteProduct(parseInt(req.params.id));
        else
            throw new ForbiddenException('ID incorrect');


        
    }
    

    @Put("updateProduct")
    @UseInterceptors(FileInterceptor('image'))
    async update(@UploadedFile() image: Express.Multer.File, @Body() dto: any, @GetUser('role') role) {
        console.log(role);
        try {
            if(role == "Admin") {    
                const imageUrl = await this.filesService.createFile(image);
                console.log(dto);

                const product = await this.productService.updateProduct(dto, imageUrl);
                return product;
            }
            else
                throw new ForbiddenException("Нет прав");
        } 
        catch (error) {
            throw new ForbiddenException("Invalid request")
        }
    }

    
    @Post("addProduct")
    @UseInterceptors(FileInterceptor('image'))
    async create(@UploadedFile() image: Express.Multer.File, @Body() dto: any, @GetUser('role') role) {
        console.log(role);
        try {
            if(role == "Admin") {    
                const imageUrl = await this.filesService.createFile(image);
                console.log(dto);

                const product = await this.productService.addProduct(dto, imageUrl);
                return product;
            }
            else
                throw new ForbiddenException("Нет прав");
        } 
        catch (error) {
            throw new ForbiddenException("Invalid request")
        }
    }

    @Public()
    @Get('search')
    async searchProductsByTitle(@Req() req : Request) {
        console.log(req.query);
        if((req.query.title || req.query.title.toString() == "")
            && !req.query.categoryId 
            && !req.query.limit 
            && !req.query.offset 
            && !req.query.price_min 
            && !req.query.price_max 
            && Object.keys(req.query).length == 1)
            return await this.productService.searchProductsByTitle(req.query.title.toString());
        else if((req.query.title || req.query.title.toString() == "")
            && (req.query.categoryId &&  /^\d+$/.test(req.query.categoryId.toString()))
            && (req.query.limit &&  /^\d+$/.test(req.query.limit.toString()))
            && (req.query.offset &&  /^\d+$/.test(req.query.offset.toString()))
            && (req.query.price_min &&  /^\d+$/.test(req.query.price_min.toString()))
            && (req.query.price_max &&  /^\d+$/.test(req.query.price_max.toString()))
            && Object.keys(req.query).length == 6
        ) {
            
            if(req.query.title.toString() == "" && parseInt(req.query.price_min.toString()) == 0 && parseInt(req.query.price_max.toString()) == 0)
                return await this.productService.searchProductsByCategory(parseInt(req.query.categoryId.toString()), parseInt(req.query.limit.toString()), parseInt(req.query.offset.toString()));
            else
                return await this.productService.searchProductsByFilter(
                    parseInt(req.query.categoryId.toString()),
                    req.query.title.toString(),
                    parseInt(req.query.price_min.toString()),
                    parseInt(req.query.price_max.toString()),
                    parseInt(req.query.limit.toString()), 
                    parseInt(req.query.offset.toString())
                );
        }
        else if((req.query.title || req.query.title.toString() == "")
            && !req.query.categoryId 
            && (req.query.limit &&  /^\d+$/.test(req.query.limit.toString()))
            && (req.query.offset &&  /^\d+$/.test(req.query.offset.toString()))
            && (req.query.price_min &&  /^\d+$/.test(req.query.price_min.toString()))
            && (req.query.price_max &&  /^\d+$/.test(req.query.price_max.toString()))
            && Object.keys(req.query).length == 5
        ) {
            return await this.productService.searchAllProducts(
                req.query.title.toString(),
                parseInt(req.query.price_min.toString()),
                parseInt(req.query.price_max.toString()),
                parseInt(req.query.limit.toString()), 
                parseInt(req.query.offset.toString())
            );
        }
        else
            throw new ForbiddenException('Invalid request');

        
    }

    
}
