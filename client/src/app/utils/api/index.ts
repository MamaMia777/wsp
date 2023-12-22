import axios from 'axios';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import { categoryApi } from './categoryApi';
import { usersApi } from './usersApi';

export type ApiReturnType = {
  categories: ReturnType<typeof categoryApi>;
  usersApi: ReturnType<typeof usersApi>;
};
const Api = (ctx?: NextPageContext | GetServerSidePropsContext): ApiReturnType => {
  const instance = axios.create({
      baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/' : 'https://api.wsp.company/',
      headers: {
      },
      withCredentials: true
    })

  const api = {
    categories: categoryApi,
    usersApi: usersApi
  };

  return Object.entries(api).reduce((prev, [key, f]) => ({
    ...prev,
    [key]: f(instance),
  }), {} as ApiReturnType);
};

export default Api;
