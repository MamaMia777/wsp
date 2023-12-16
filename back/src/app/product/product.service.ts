import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ParserService } from 'src/parser/parser.service';

@Injectable()
export class ProductService {
  public constructor(
    private readonly parserService: ParserService,
    private readonly databaseService: DatabaseService,
  ) {}
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
        const isOlder = timeDifference / (1000 * 60) > 1000;

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
