
import { IMarketMin, ISelectedCombination, ISupplierData } from './interfaces';

export * from './interfaces'
export * from './Providers'
export * from './api'

export const findMinimalMarketPriceByOption = (
    allRecords: Array<ISupplierData>,
    parrentId: number,
    childrenId: number | null
  ): IMarketMin => {
    let marketMin: IMarketMin = {
      price: Number.POSITIVE_INFINITY,
      supplier: "",
    };
    for (var supplier of allRecords) {
      const option = supplier.options[parrentId];
      if (option.subOptions && childrenId !== null) {
        const subOption = option.subOptions[childrenId!];
        if (subOption.price! < marketMin.price) {
          marketMin = {
            supplier: supplier.companyName,
            price: subOption.price!,
          };
        }
      } else {
        if (option.price! < marketMin.price) {
          marketMin = {
            supplier: supplier.companyName,
            price: option.price!,
          };
        }
      }
    }
    return marketMin;
  };
  
export const findRegionsMinimalPriceSupplier = (
    allRecords: any,
    region: "RIGA" | "KURZEME" | "LATGALE" | "VIDZEME" | "ZEMGALE"
  ) => {
    let marketMin: IMarketMin = {
      price: Number.POSITIVE_INFINITY,
      supplier: "",
    };
    for (var supplier of allRecords) {
      const price = supplier.priceList.find(
        (el: any) => el.city === region
      )?.price;
      if (price! < marketMin.price) {
        marketMin = {
          supplier: supplier.companyName,
          price: price!,
        };
      }
    }
    return marketMin;
  };
  
export const findMinimalCombinationPrice = (
    allRecords: Array<ISupplierData>,
    combination: Array<ISelectedCombination>,
    region: string
  ): IMarketMin => {
    let minimalCombinationPrice: IMarketMin = {
      price: Number.POSITIVE_INFINITY,
      supplier: "",
    };
    for (const supplier of allRecords) {
      let totalCombinationPrice = 0;

      const basePrice = supplier.priceList.find(
        (el) => el.city === region
      )!.price;
      const singleOptionSum = supplier.options.filter((el) => !el.subOptions).reduce((acc, el) => acc + el.price!, 0);
      totalCombinationPrice += singleOptionSum + basePrice;
  
      for (const option of combination) {
        const [parentId, childrenId] = option;
        const optionPrice =
          childrenId !== null
            ? supplier.options[parentId].subOptions![childrenId].price!
            : supplier.options[parentId].price!;
        totalCombinationPrice += optionPrice;
      }
      if (totalCombinationPrice < minimalCombinationPrice.price) {
        minimalCombinationPrice = {
          price: totalCombinationPrice,
          supplier: supplier.companyName,
          basePrice,
        };
      }
    }
  
    return minimalCombinationPrice;
  };

export const calculateOurCombinationPrice = (
  ourRecord: ISupplierData,
  combinations: Array<ISelectedCombination>,
) => {
    let totalOurCombinationPrice = 0;
    const ourOptions = ourRecord.options;
    for (var combination of combinations) {
      const [parrentId, childrenId] = combination;
      totalOurCombinationPrice +=
        childrenId !== null
          ? ourOptions[parrentId].subOptions![childrenId].price!
          : ourOptions[parrentId].price!;
    }
    totalOurCombinationPrice += ourRecord.options.filter((el) => !el.subOptions).reduce((acc, el) => acc + el.price!, 0);
    return totalOurCombinationPrice
}

export const inputNumberValidator = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const allowedPattern = /^[\d,.\b]+$/;

  if (!allowedPattern.test(value)) e.preventDefault()
  return value

  // Check if the input matches the allowed pa
}