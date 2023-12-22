export interface ICategoryBasic {
  categoryId: string;
  name: string;

}
export interface ICategoryFull {
  categoryId: string;
  changeAttempts: number;
  name: string;
  productId: string;
  updateAt: Date;
  data: Array<ISupplierData>
}

export interface ISupplierData {
  companyName: string;
  priceList: Array<IPrice>;
  discounts: Array<IDiscount>
  options: Array<IOption>;
}

export interface IChangeEisData extends ISupplierData {
  categoryId: string;
}
export interface IPrice {
  city: string;
  price: number;
}

export interface IOption{
  name: string;
  price?: number,
  subOptions?: Array<IOption>;
  marketMin?: IMarketMin
}


export interface IMarketMin{
  price: number,
  supplier: string,
  basePrice?: number,
  discountPerQuantity?:number
}

export interface IRegion {
  RIGA: IRegionData;
  KURZEME: IRegionData;
  LATGALE: IRegionData;
  VIDZEME: IRegionData;
  ZEMGALE: IRegionData;
}

export interface IRegionData {
  price: number;
  marketMinPrice: IMarketMin;
  combinationPrice: number;
  combinationMarketMinPrice: IMarketMin;
}
export interface IDiscount {
  amount: string;
  discount: string;
}