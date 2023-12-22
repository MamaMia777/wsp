import { AxiosInstance } from 'axios';
import {ICategoryBasic, IChangeEisData, ISupplierData } from '..';

export const categoryApi = (instance: AxiosInstance) => ({
  async getCategories() {
    const { data }= await instance.get<null, {data: Array<ICategoryBasic>}>(
      '/products',
    );
    return data;
  },
  async deleteCategory(categoryId: string) {
    const { data }= await instance.delete<null, {data: any}>(
      `/products/${categoryId}`,
    );
    return data;
  },
  async updateCategoryInEis(data: IChangeEisData) {
    const { data: responseData } = await instance.post<IChangeEisData, any>(
      '/products/eis',
      data,
    );
    return responseData;
  },
  async fetchCategory(categoryId: string){
    const { data } = await instance.post<null, {data: any}>(
      '/products',
      { categoryId },
    );
    return data;
  }
});
