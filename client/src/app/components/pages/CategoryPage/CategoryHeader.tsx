import Link from "next/link";
import Image from "next/image";
interface IProps {
  categoryId: string;
  name: string;
}

const CategoryHeader: React.FC<IProps> = ({ categoryId, name }) => {
  return (
    <div className="flex justify-between flex-col md:flex-row mb-2">
      <div>
        <div className="flex gap-4 items-center mt-2">
          <h1>{categoryId}</h1>
          <Link
            href={`https://www.eis.gov.lv/EIS/Categories/SearchFaProducts.aspx?FaNumber=${categoryId}`}
            target="__blank"
          >
            <Image
              src={"/ui/Link.svg"}
              width={20}
              height={20}
              className="cursor-pointer hover:scale-110"
              alt="wsp"
            />
          </Link>
        </div>
        {name.length > 0 ? (
          <p className="mt-2 text-medium">{name}</p>
        ) : (
          <div className="px-8 py-2 rounded-md bg-gray-200 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};
export default CategoryHeader;
