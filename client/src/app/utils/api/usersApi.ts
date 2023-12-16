import { AxiosInstance } from 'axios';
import {ICategoryBasic, IUser } from '..';

export const usersApi = (instance: AxiosInstance) => ({
  async getUsers() {
    const { data }= await instance.get<null, {data: Array<IUser>}>(
      '/users',
    );
    return data;
  },
  async deleteUser(email: string) {
    const { data } = await instance.delete<null, {data: IUser}>(
      `/users`,
    );
    {
      email
    }
    return data;
  }
});
