import { IOption } from './IOption';
import { IPrice } from './IPRiceList';

export interface ICategory {
  categoryId: string;
  productId: string;
  name: string;
  eisData: Array<IParseCategoryResult>;
}
export interface IParseCategoryResult {
  companyName: string;
  priceList: Array<IPrice>;
  options: Array<IOption>;
  discounts: Array<IDiscount | null>;
}
interface IDiscount {
  amount: string;
  discount: string;
}
