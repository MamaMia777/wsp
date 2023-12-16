import { IRegion } from "@wsp/app/utils";
import Image from "next/image";
import { useMemo } from "react";
interface IProps {
  data: IRegion;
  handleRegionBasePriceChange: (region: keyof IRegion, price: number) => void;
}
const OveralTable: React.FC<IProps> = ({
  data,
  handleRegionBasePriceChange,
}) => {
  if (!data) return null;
  const regions = Object.keys(data);

  const memoizedHandleRegionBasePriceChange = useMemo(() => {
    return handleRegionBasePriceChange;
  }, [handleRegionBasePriceChange]);

  return (
    <div className="w-fit">
      <h1>Overall</h1>
      <table className="w-full h-fit">
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
                <div className="text-[9px] text-center">
                  {
                    data[region as keyof IRegion].combinationMarketMinPrice
                      .supplier
                  }
                </div>
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2, 3, 4].map((el) => (
              <td key={`fake-${el}`} className="font-bold pt-[1rem]">
                {el === 0 ? "%, DISCOUNTS" : <>&nbsp;</>}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default OveralTable;
