import { AxiosInstance } from 'axios';
import {ICategoryBasic } from '..';

export const categoryApi = (instance: AxiosInstance) => ({
  async getCategories() {
    const { data }= await instance.get<null, {data: Array<ICategoryBasic>}>(
      '/products',
    );
    return data;
  },
  async fetchCategory(categoryId: string){
    const { data } = await instance.post<null, {data: any}>(
      '/products',
      { categoryId },
    );
    return data;
  }
});
