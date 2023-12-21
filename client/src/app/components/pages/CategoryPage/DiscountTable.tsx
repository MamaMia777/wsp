import { IDiscount, inputNumberValidator } from "@wsp/app/utils";

const DiscountTable = ({
  discounts,
  handleDiscountChange,
}: {
  discounts: Array<IDiscount>;
  handleDiscountChange: (
    index: number,
    amount?: string,
    discount?: string
  ) => void;
}) => {
  return (
    <div>
      <p className="text-[black] font-bold  border-t border-b mt-4">
        SIA WSP discounts
      </p>
      <div className="w-[200px]">
        {discounts.map((el, id) => {
          return (
            <div key={id} className="grid grid-cols-2 gap-2 mb-1">
              <input
                placeholder="Q"
                onChange={(e) => {
                  if (inputNumberValidator(e))
                    handleDiscountChange(id, e.target.value);
                }}
                value={el?.amount ?? ""}
                className="border text-[1.1rem] p-2  focus:ring focus:border-blue-300 "
              />
              <input
                placeholder="%"
                value={el?.discount ?? ""}
                onChange={(e) => {
                  if (inputNumberValidator(e))
                    handleDiscountChange(id, undefined, e.target.value);
                }}
                className="border text-[1.1rem] p-2"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DiscountTable;
