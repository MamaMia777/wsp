import { IRegion } from "@wsp/app/utils";
import Image from "next/image";
import { useMemo } from "react";
interface IProps {
  data: IRegion;
  handleRegionBasePriceChange: (region: keyof IRegion, price: number) => void;
  marketDiscountsQuantityList: Array<number>;
  activeQuantity: number;
  setActiveQuantity: React.Dispatch<React.SetStateAction<number>>;
}
const OveralTable: React.FC<IProps> = ({
  data,
  handleRegionBasePriceChange,
  marketDiscountsQuantityList,
  activeQuantity,
  setActiveQuantity,
}) => {
  const memoizedHandleRegionBasePriceChange = useMemo(() => {
    return handleRegionBasePriceChange;
  }, [handleRegionBasePriceChange]);
  if (!data) return null;
  const regions = Object.keys(data);

  return (
    <div className="w-fit">
      <table className="w-full h-fit mb-2">
        <thead>
          <tr className="border-t border-b">
            {Object.keys(data).map((region) => (
              <th key={`header-${region}`} className="text-right w-1/5">
                {region}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {regions.map((region) => (
              <td className={`text-right text-[1.1rem] font-mono`} key={region}>
                <div>
                  <input
                    value={data[region as keyof IRegion].price}
                    type="number"
                    step={0.01}
                    onChange={(e) => {
                      memoizedHandleRegionBasePriceChange(
                        region as keyof IRegion,
                        e.target.valueAsNumber
                      );
                    }}
                    className="w-full text-right bg-[transparent] border border-[gray]"
                  />
                </div>
              </td>
            ))}
          </tr>
          <tr>
            {regions.map((region) => (
              <td className={`text-[1.1rem] font-mono`} key={region}>
                <div className="flex justify-between items-end px-2">
                  <span className="font-bold text-[.8rem] text-[black]">
                    min
                  </span>
                  {data[region as keyof IRegion].marketMinPrice.price}
                </div>
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2, 3, 4].map((el) => (
              <td key={`fake-${el}`} className="font-bold">
                &nbsp;
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2, 3, 4].map((el) => (
              <td key={`fake-${el}`} className="font-bold">
                {el === 0 ? "SIA WSP" : <>&nbsp;</>}
              </td>
            ))}
          </tr>
          <tr>
            {regions.map((region) => (
              <td
                className={`px-3 text-[1.1rem] font-mono border `}
                key={region}
              >
                <div className="flex gap-3 font-mono justify-between">
                  <Image
                    src="/ui/combination.svg"
                    width={20}
                    height={20}
                    alt="wsp"
                  />
                  <span className="">
                    {data[region as keyof IRegion].combinationPrice.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`flex gap-3 font-mono justify-between ${
                    data[region as keyof IRegion].combinationPrice +
                      data[region as keyof IRegion].price <=
                    data[region as keyof IRegion].combinationMarketMinPrice
                      .price
                      ? "bg-success"
                      : "bg-negative"
                  }`}
                >
                  <Image src="/ui/Box.svg" width={20} height={20} alt="wsp" />
                  <span className="text-[black]">
                    {(
                      data[region as keyof IRegion].combinationPrice +
                      data[region as keyof IRegion].price
                    ).toFixed(2)}
                  </span>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2, 3, 4].map((el) => (
              <td key={`fake-2-${el}`} className="font-bold pt-5">
                {el === 0 ? "WINNER" : <>&nbsp;</>}
              </td>
            ))}
          </tr>
          <tr className="">
            {regions.map((region) => (
              <td
                className="border px-3 text-right text-[1.1rem] font-mono"
                key={region}
              >
                <div className="flex gap-3 font-mono justify-between">
                  <Image
                    src="/ui/bookmark.svg"
                    width={20}
                    height={20}
                    alt="wsp"
                  />
                  <span className="">
                    {data[
                      region as keyof IRegion
                    ].combinationMarketMinPrice.basePrice!.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3 font-mono  justify-between">
                  <Image
                    src="/ui/combination.svg"
                    width={20}
                    height={20}
                    alt="wsp"
                  />
                  <span className="">
                    {(
                      data[region as keyof IRegion].combinationMarketMinPrice
                        .price -
                      data[region as keyof IRegion].combinationMarketMinPrice
                        .basePrice!
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3 font-mono  justify-between">
                  <Image src="/ui/Box.svg" width={20} height={20} alt="wsp" />
                  <span className="text-[black]">
                    {data[
                      region as keyof IRegion
                    ].combinationMarketMinPrice.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3 font-mono  justify-between border-b border-t bg-accent">
                  <span className="font-bold">%</span>
                  <span className="text-[black] ml-4">
                    {data[
                      region as keyof IRegion
                    ].combinationMarketMinPrice.discountPerQuantity?.toFixed(2)}
                  </span>
                </div>
                <div className="text-[9px] text-center">
                  {
                    data[region as keyof IRegion].combinationMarketMinPrice
                      .supplier
                  }
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <p className="text-[black] font-bold  border-t border-b">QUANTITY</p>
      <div className="w-full flex gap-2 mt-2">
        {marketDiscountsQuantityList.map((el, key) => {
          return (
            <button
              key={key}
              onClick={() => {
                setActiveQuantity(el);
              }}
              className={`w-[50px] h-[50px] border rounded-sm hover:bg-accent ${
                activeQuantity === el
                  ? "bg-accent border-[gray]"
                  : "bg-transparent"
              }`}
            >
              {el}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default OveralTable;
