import { Request } from 'express';
export * from './IPRiceList';
export * from './IOption';
export * from './IProduct';

export interface RequestInterface extends Request {
  email: string;
  //   role: UserRoles;
}
