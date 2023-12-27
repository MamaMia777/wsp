"use client";
import OptionTable from "./OptionTable";
import {
  ICategoryFull,
  IRegion,
  IRegionData,
  ISelectedCombination,
  ISupplierData,
  calculateOurCombinationPrice,
  findMinimalCombinationPrice,
  findMinimalMarketPriceByOption,
  findRegionsMinimalPriceSupplier,
} from "@wsp/app/utils";
import { useEffect, useState } from "react";
import CategoryHeader from "./CategoryHeader";
import OveralTable from "./OveralTable";
import { useMutation } from "react-query";
import Api from "@wsp/app/utils/api";
import Image from "next/image";
import DiscountTable from "./DiscountTable";

const SkeletonFrame = ({
  isLoading,
  isError,
}: {
  isLoading: boolean;
  isError: boolean;
}) => {
  return (
    <div className="grid grid-cols-2 grid-rows-3 flex-1 gap-6 ">
      {[1, 2, 3].map((el) => {
        return (
          <div
            key={`fake-${el}`}
            className={`flex items-center justify-center ${
              el === 1 ? "row-span-3" : el === 2 ? "row-span-2" : "row-span-1"
            }  w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-md`}
          >
            {isLoading && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="white"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="black"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {isError && <div className="text-[red] font-bold">Error...</div>}
          </div>
        );
      })}
    </div>
  );
};

export default function CategoryPageComponent({
  categoryId,
}: {
  categoryId: string;
}) {
  const [categoryData, setCategoryData] = useState<ICategoryFull | null>(null);
  const [discountsQuantity, setDiscountsQuantity] = useState<Array<number>>([]);
  const [activeQuantity, setActiveQuantity] = useState<number>(1);
  const [overalData, setOveralData] = useState<IRegion | null>(null);
  const [ourRecordCopy, setOurRecordCopy] = useState<ISupplierData | null>();
  const [selectedCombination, setSelectedCombination] = useState<
    Array<ISelectedCombination>
  >([]);

  const {
    mutate: parseCategory,
    isLoading,
    isError,
  } = useMutation(
    () => Api().categories.fetchCategory(categoryId.toUpperCase()),
    {
      onSuccess: (data) => {
        setCategoryData(data);
      },
      onError: (err) => {
        console.log(err);
      },
      onSettled: () => {},
    }
  );

  const handleOptionPriceChange = (
    parentId: number,
    childrenId: number | null,
    value: number
  ) => {
    const newOptionPrices = [...ourRecordCopy!.options];
    if (childrenId !== null) {
      newOptionPrices[parentId].subOptions![childrenId].price = value;
    } else {
      newOptionPrices[parentId].price = value;
    }
    setOurRecordCopy((prev) => {
      return {
        ...prev!,
        options: newOptionPrices,
      };
    });
  };

  const handleRegionBasePriceChange = (region: string, value: number) => {
    const newPriceList = [...ourRecordCopy!.priceList];
    newPriceList.find((el) => el.city === region)!.price = value;
    setOurRecordCopy((prev) => {
      return {
        ...prev!,
        priceList: newPriceList,
      };
    });
  };

  const getRegionData = (
    city: "RIGA" | "KURZEME" | "VIDZEME" | "ZEMGALE" | "LATGALE"
  ): IRegionData => {
    const price = ourRecordCopy!.priceList.find(
      (el) => el.city === city
    )!.price;
    const marketMinPrice = findRegionsMinimalPriceSupplier(
      categoryData!.data,
      city
    );
    const combinationPrice = calculateOurCombinationPrice(
      ourRecordCopy!,
      selectedCombination
    );
    const combinationMarketMinPrice = findMinimalCombinationPrice(
      [
        ...categoryData!.data.filter((el) => el.companyName !== '"WSP" SIA'),
        ourRecordCopy!,
      ],
      selectedCombination,
      city,
      activeQuantity
    );

    return {
      price,
      marketMinPrice,
      combinationPrice,
      combinationMarketMinPrice,
    };
  };

  const handleDiscountChange = (
    index: number,
    amount?: string,
    discount?: string
  ) => {
    const newDiscounts = [...ourRecordCopy!.discounts];
    if (!newDiscounts[index]) {
      newDiscounts[index] = { amount: "", discount: "" };
    }
    if (amount || amount?.length === 0) newDiscounts[index].amount = amount;
    if (discount || discount?.length === 0)
      newDiscounts[index].discount = discount;
    setOurRecordCopy((prev) => {
      return {
        ...prev!,
        discounts: newDiscounts,
      };
    });
  };

  useEffect(() => {
    parseCategory();
  }, [categoryId]);

  useEffect(() => {
    if (!categoryData) return;
    console.log(categoryData);
    const ourRecord = categoryData.data.find((el) =>
      el.companyName.toLowerCase().includes("wsp")
    );
    if (!ourRecord) return;
    const newOurRecord = {
      ...ourRecord,
      options: ourRecord.options.map((el, parrentId) => {
        return {
          ...el,
          marketMin: findMinimalMarketPriceByOption(
            categoryData.data,
            parrentId,
            null
          ),
          subOptions: el.subOptions?.map((subEl, childrenId) => {
            return {
              ...subEl,
              marketMin: findMinimalMarketPriceByOption(
                categoryData.data,
                parrentId,
                childrenId
              ),
            };
          }),
        };
      }),
    };
    setOurRecordCopy(newOurRecord);

    // DISCOUNTS
    setDiscountsQuantity(() => {
      const discountList = categoryData.data.flatMap((el) => el.discounts);
      const discountQuantities: Array<number> = [1];
      discountList.forEach((el) => {
        if (!el) return;
        if (discountQuantities.includes(+el.amount)) return;
        discountQuantities.push(+el.amount);
      });
      return discountQuantities;
    });
  }, [categoryData]);

  useEffect(() => {
    if (!ourRecordCopy) {
      return;
    }
    const newOveralData: IRegion = {
      RIGA: getRegionData("RIGA"),
      KURZEME: getRegionData("KURZEME"),
      LATGALE: getRegionData("LATGALE"),
      VIDZEME: getRegionData("VIDZEME"),
      ZEMGALE: getRegionData("ZEMGALE"),
    };
    setOveralData(newOveralData);
  }, [ourRecordCopy, selectedCombination, activeQuantity]);

  return (
    <div className="flex flex-col h-full py-4">
      <CategoryHeader
        categoryId={categoryId}
        name={categoryData?.name ?? ""}
        ourRecordData={ourRecordCopy!}
        changeAttempts={categoryData?.changeAttempts ?? -1}
        parseCategory={parseCategory}
      />
      {isLoading ||
      isError ||
      !categoryData ||
      !ourRecordCopy ||
      !overalData ? (
        <SkeletonFrame isLoading={isLoading} isError={isError} />
      ) : (
        <div className="w-full flex gap-[4rem] justify-between">
          {ourRecordCopy.options.length > 0 && (
            <div className="w-1/2">
              <OptionTable
                data={ourRecordCopy.options}
                handleOptionPriceChange={handleOptionPriceChange}
                selectedCombination={selectedCombination}
                setSelectedCombination={setSelectedCombination}
              />
            </div>
          )}
          <div className="w-1/2">
            <OveralTable
              marketDiscountsQuantityList={discountsQuantity}
              data={overalData}
              handleRegionBasePriceChange={handleRegionBasePriceChange}
              activeQuantity={activeQuantity}
              setActiveQuantity={setActiveQuantity}
            />
            <DiscountTable
              discounts={ourRecordCopy.discounts ?? []}
              handleDiscountChange={handleDiscountChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
