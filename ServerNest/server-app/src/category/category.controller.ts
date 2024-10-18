import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Public } from 'src/auth/decorator';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Public()
    @Get('all')
    async getCategories() {
        return await this.categoryService.getCategories();
    }

}
