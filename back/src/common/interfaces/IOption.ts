export interface IOption {
  name: string;
  subOptions?: IOption[];
  price?: number;
}
