import { IOption, ISelectedCombination } from "@wsp/app/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IProps {
  data: IOption[] | undefined;
  handleOptionPriceChange: (
    parrentId: number,
    childrenId: number | null,
    price: number
  ) => void;
  selectedCombination: Array<ISelectedCombination>;
  setSelectedCombination: React.Dispatch<
    React.SetStateAction<Array<ISelectedCombination>>
  >;
}
interface IOptionTableRowProps {
  name: string;
  ourPrice: number;
  minMarketPrice: {
    price: number;
    supplier: string;
  };
  index: number;
  parrentIndex: number;
  childrenIndex: number | null;
  singleOption: boolean;
  handleOptionPriceChange: (
    parrentId: number,
    childrenId: number | null,
    price: number
  ) => void;
  selectedCombination: Array<ISelectedCombination>;
  setSelectedCombination: React.Dispatch<
    React.SetStateAction<Array<ISelectedCombination>>
  >;
}
const OptionTableRow: React.FC<IOptionTableRowProps> = ({
  name,
  ourPrice,
  minMarketPrice,
  parrentIndex,
  childrenIndex,
  index,
  singleOption,
  handleOptionPriceChange,
  selectedCombination,
  setSelectedCombination,
}) => {
  const [optionSelected, setOptionSelected] = useState(false);
  name = name.replace(/\([^)]*\)/g, "");

  const handleOptionClick = () => {
    // if (singleOption) return;
    setSelectedCombination((prev) => {
      const isDuplicate = prev.some(
        ([parent, child]) => parent === parrentIndex && child === childrenIndex
      );
      if (isDuplicate) {
        return prev.filter(
          ([parent, child]) =>
            !(parent === parrentIndex && child === childrenIndex)
        );
      }
      return [
        ...prev.filter(([parent]) => parent !== parrentIndex),
        [parrentIndex, childrenIndex],
      ];
    });
  };

  useEffect(() => {
    setOptionSelected(() => {
      return selectedCombination.some(
        ([parent, child]) => parent === parrentIndex && child === childrenIndex
      );
    });
  }, [selectedCombination, parrentIndex, childrenIndex]);

  return (
    <div
      onClick={handleOptionClick}
      key={name}
      className={`cursor-pointer w-full grid grid-cols-[84%,8%,8%]  ${
        index % 2 === 0 ? "bg-accent" : ""
      } hover:font-bold hover:text-[black] ${
        singleOption ? "border-b border-t" : ""
      } ${optionSelected ? "border bg-[yellow!important]" : ""}`}
    >
      <span className="border-r">
        {singleOption ? (
          <div className="flex items-center gap-2">
            <Image src="/ui/Box.svg" width={15} height={15} alt="wsp" />
            <h2 className="text-[1.1rem] font-bold">{name}</h2>
          </div>
        ) : (
          <span>&nbsp;&nbsp;&nbsp;&nbsp;{name}</span>
        )}
      </span>

      <input
        className={`border-r text-center bg-opacity-75 ${
          '"WSP" SIA' !== minMarketPrice.supplier ? "bg-negative" : "bg-success"
        } focus:bg-[white] focus:outline-none`}
        type="number"
        step={0.01}
        value={ourPrice}
        onChange={(e) =>
          handleOptionPriceChange(
            parrentIndex,
            childrenIndex,
            e.target.valueAsNumber
          )
        }
      />
      <span className="font-mono text-center relative inline-block group">
        [{minMarketPrice.price.toFixed(2)}]
        <span className="w-[200px] tooltip-text hidden group-hover:block bg-accent text-white text-center py-1 px-2 rounded absolute top-1/2 left-full transform -translate-y-1/2">
          {minMarketPrice.supplier}
        </span>
      </span>
    </div>
  );
};

const OptionTable: React.FC<IProps> = ({
  data,
  handleOptionPriceChange,
  selectedCombination,
  setSelectedCombination,
}) => {
  if (!data) return <h1>No data</h1>;

  return (
    <div className="w-full">
      {data.map((option, parrentIndex) => {
        return (
          <div key={parrentIndex} className="mb-4">
            {option.name && option.subOptions && (
              <div
                key={option.name}
                className="flex items-center gap-2 border-b border-t"
              >
                <Image src="/ui/Box.svg" width={15} height={15} alt="wsp" />
                <h2 className="text-[1.1rem] font-bold">
                  {option.name.replace(/\([^)]*\)/g, "").replace("*", "")}
                </h2>
              </div>
            )}

            {option.name && !option.subOptions && (
              <OptionTableRow
                key={option.name}
                name={option.name.replace("*", "")}
                ourPrice={option.price!}
                minMarketPrice={option.marketMin!}
                index={parrentIndex}
                singleOption={true}
                handleOptionPriceChange={handleOptionPriceChange}
                parrentIndex={parrentIndex}
                childrenIndex={null}
                selectedCombination={selectedCombination}
                setSelectedCombination={setSelectedCombination}
              />
            )}

            {option.subOptions?.map((subOption, childreIndex) => {
              return (
                <OptionTableRow
                  key={subOption.name}
                  name={subOption.name.replace("*", "")}
                  ourPrice={subOption.price!}
                  minMarketPrice={subOption.marketMin!}
                  index={childreIndex}
                  singleOption={false}
                  handleOptionPriceChange={handleOptionPriceChange}
                  parrentIndex={parrentIndex}
                  childrenIndex={childreIndex}
                  selectedCombination={selectedCombination}
                  setSelectedCombination={setSelectedCombination}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
export default OptionTable;
