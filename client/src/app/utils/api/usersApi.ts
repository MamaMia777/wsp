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
  },
  async getGoogleLoginLink(): Promise<string>{
    const { data } = await instance.get<null, {data: any}>(
      '/auth/social/google/link',
    );
    return data;
  },
  async getMe(): Promise<any>{
    const { data } = await instance.get<null, {data: any}>(
      '/auth',
    );
    return data;
  },
  async googleLogin(code: string) {
    const { data } = await instance.post<null, {data: any}>(
      `auth/social/google/login?code=${code}`,
    );
    return data;
    
  }
});
