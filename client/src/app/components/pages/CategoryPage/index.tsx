"use client";
import OptionTable from "./OptionTable";
import {
  ICategoryFull,
  IRegion,
  IRegionData,
  ISupplierData,
  calculateOurCombinationPrice,
  findMinimalCombinationPrice,
  findMinimalMarketPriceByOption,
  findRegionsMinimalPriceSupplier,
} from "@wsp/app/utils";
import { useEffect, useState } from "react";
import CategoryHeader from "./CategoryHeader";
import OveralTable from "./OveralTable";
import { ISelectedCombination } from "@wsp/app/components/pages";
import { useMutation } from "react-query";
import Api from "@wsp/app/utils/api";
import Image from "next/image";

const SkeletonFrame = ({
  isLoading,
  isError,
}: {
  isLoading: boolean;
  isError: boolean;
}) => {
  return (
    <div className="grid grid-cols-2 grid-rows-3 flex-1 gap-6 ">
      <div className=" flex items-center justify-center row-span-3 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-md">
        {isLoading && (
          <Image
            className="animate-bounce animate-infinite animate-ease-in"
            src="/logo.png"
            width={200}
            height={200}
            alt="wsp"
          />
        )}
        {isError && <div className="text-[red] font-bold">Error...</div>}
      </div>
      <div className=" flex items-center justify-center row-span-2 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-md">
        {isLoading && (
          <Image
            className="animate-bounce animate-infinite animate-ease-in"
            src="/logo.png"
            width={200}
            height={200}
            alt="wsp"
          />
        )}
        {isError && <div className="text-[red] font-bold">Error...</div>}
      </div>
      <div className=" flex items-center justify-center row-span w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-md">
        {isLoading && (
          <Image
            className="animate-bounce animate-infinite animate-ease-in"
            src="/logo.png"
            width={200}
            height={200}
            alt="wsp"
          />
        )}
        {isError && <div className="text-[red] font-bold">Error...</div>}
      </div>
    </div>
  );
};

export default function CategoryPageComponent({
  categoryId,
}: {
  categoryId: string;
}) {
  const [categoryData, setCategoryData] = useState<ICategoryFull | null>(null);
  const [overalData, setOveralData] = useState<IRegion | null>(null);
  const [ourRecordCopy, setOurRecordCopy] = useState<ISupplierData | null>();
  const [selectedCombination, setSelectedCombination] = useState<
    Array<ISelectedCombination>
  >([]);

  const { mutate, isLoading, isError } = useMutation(
    () => Api().categories.fetchCategory(categoryId.toUpperCase()),
    {
      onSuccess: (data) => {
        console.log(data);
        setCategoryData(data);
      },
      onError: (err) => {
        // console.log(err);
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
      city
    );

    return {
      price,
      marketMinPrice,
      combinationPrice,
      combinationMarketMinPrice,
      discounts: [],
    };
  };

  useEffect(() => {
    mutate();
  }, [categoryId]);

  useEffect(() => {
    if (!categoryData) return;
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
  }, [categoryData]);

  useEffect(() => {
    if (!ourRecordCopy) return;

    const newOveralData: IRegion = {
      RIGA: getRegionData("RIGA"),
      KURZEME: getRegionData("KURZEME"),
      LATGALE: getRegionData("LATGALE"),
      VIDZEME: getRegionData("VIDZEME"),
      ZEMGALE: getRegionData("ZEMGALE"),
    };
    setOveralData(newOveralData);
  }, [ourRecordCopy, selectedCombination]);

  return (
    <section className="page flex flex-col h-full py-4">
      <CategoryHeader categoryId={categoryId} name={categoryData?.name ?? ""} />
      {isLoading ||
      isError ||
      !categoryData ||
      !ourRecordCopy ||
      !overalData ? (
        <SkeletonFrame isLoading={isLoading} isError={isError} />
      ) : (
        <div className="w-full grid grid-cols-2  flex-1 gap-[4rem]">
          {ourRecordCopy.options.length > 0 && (
            <OptionTable
              data={ourRecordCopy.options}
              handleOptionPriceChange={handleOptionPriceChange}
              selectedCombination={selectedCombination}
              setSelectedCombination={setSelectedCombination}
            />
          )}
          <OveralTable
            data={overalData}
            handleRegionBasePriceChange={handleRegionBasePriceChange}
          />
        </div>
      )}
    </section>
  );
}
