import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { IUpdateEisCategory } from 'src/common/interfaces';
import { DatabaseService } from 'src/database/database.service';
import { ParserService } from 'src/parser/parser.service';

@Injectable()
export class ProductService {
  public constructor(
    private readonly parserService: ParserService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Cron('0 0 * * *')
  async resetChangeAttempts() {
    try {
      await this.databaseService.category.updateMany({
        data: { changeAttempts: 5 },
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to reset changeAttempts');
    }
  }
  async fetchCategory(categoryId: string) {
    try {
      const existingCategory = await this.databaseService.category.findUnique({
        where: { categoryId: categoryId },
      });
      if (existingCategory) {
        // Check if the data is older than 3 minutes
        const fetchedTime = existingCategory.updateAt;
        const now = new Date();
        const timeDifference = now.getTime() - fetchedTime.getTime();
        const isOlder = timeDifference / (1000 * 60) > 3;

        if (isOlder) {
          try {
            const parsedCategory =
              await this.parserService.parseCategory(categoryId);
            if (!parsedCategory) return;

            const updatedCategory = await this.databaseService.category.update({
              where: { categoryId: parsedCategory.categoryId },
              data: {
                data: JSON.stringify(parsedCategory.eisData),
                updateAt: new Date(),
              },
            });
            return this.modifyResponseObject(updatedCategory);
          } catch (updateError) {
            console.error('Error updating category:', updateError);
            throw updateError;
          }
        } else {
          return this.modifyResponseObject(existingCategory);
        }
      } else {
        try {
          const parsedCategory =
            await this.parserService.parseCategory(categoryId);
          const createdCategory = await this.databaseService.category.create({
            data: {
              categoryId: parsedCategory.categoryId,
              productId: parsedCategory.productId,
              name: parsedCategory.name,
              data: JSON.stringify(parsedCategory.eisData),
            },
          });
          return this.modifyResponseObject(createdCategory);
        } catch (createError) {
          console.error('Error creating category:', createError);
          throw createError;
        }
      }
    } catch (error) {
      console.error('Error in fetchCategory:', error);
      throw error;
    }
  }

  async updateProductInEis(dto: IUpdateEisCategory) {
    try {
      const response = await this.parserService.updateCateogryInEis(dto);
      if (response.status === HttpStatus.OK) {
        const oldCategoryData = await this.databaseService.category.findUnique({
          where: { categoryId: dto.categoryId },
        });
        const modified = JSON.parse(oldCategoryData.data as string);
        modified.forEach((company) => {
          if (company.companyName === dto.companyName) {
            company.priceList = dto.priceList;
            company.options = dto.options;
            company.discounts = dto.discounts;
          }
        });
        const updatedCategory = await this.databaseService.category.update({
          where: { categoryId: dto.categoryId },
          data: {
            data: JSON.stringify(modified),
            updateAt: new Date(),
            changeAttempts: {
              decrement: 1,
            },
          },
        });
        if (!updatedCategory) Logger.log('Failed to save EIS changes in DB');
        return updatedCategory ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
      }
    } catch (e) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async getProducts() {
    return this.databaseService.category.findMany({
      select: {
        categoryId: true,
        name: true,
      },
    });
  }

  modifyResponseObject(payload: Prisma.CategoryCreateInput) {
    const response = {
      ...payload,
      data: JSON.parse(payload.data as string),
    };
    return response;
  }
}
