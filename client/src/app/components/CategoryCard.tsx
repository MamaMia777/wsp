import Link from "next/link";
import Image from "next/image";

interface IProps {
  name: string;
  categoryId: string;
}
export const CategoryCard: React.FC<IProps> = ({ categoryId, name }) => {
  return (
    <Link href={`/category/${categoryId}`}>
      <div className=" relative w-full h-[120px] flex flex-col bg-[hsl(0 0% 100%)] border border-accent  rounded-md p-4 hover:bg-accent transition-all duration-150">
        <h3>{categoryId}</h3>
        <p>{name.length > 70 ? name.slice(0, 69).concat(" .....") : name}</p>
      </div>
    </Link>
  );
};
