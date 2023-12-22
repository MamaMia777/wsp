"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui";
import { useMutation } from "react-query";
import Api from "../utils/api";

interface IProps {
  name: string;
  categoryId: string;
  refetch: any;
}
interface IControlMenu {
  handleDelete: () => void;
}
const ControlMenu: React.FC<IControlMenu> = ({ handleDelete }) => {
  return (
    <div className="absolute w-full h-full bg-[gray] rounded-[inherit] left-0 top-0 flex items-center justify-center">
      <Button onClick={handleDelete}>DELETE</Button>
    </div>
  );
};
export const CategoryCard: React.FC<IProps> = ({
  categoryId,
  name,
  refetch,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useRouter();
  const { mutate } = useMutation(
    () => Api().categories.deleteCategory(categoryId),
    {
      onSuccess: () => {
        refetch({
          queryKey: "categories",
        });
      },
      onError: (err) => {
        console.log(err);
      },
      onSettled: () => {},
    }
  );

  const handleDelete = () => {
    mutate();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (menuOpen) return;
    history.push(`/category/${categoryId}`);
  };
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen((prev) => !prev);
  };

  return (
    <div
      onContextMenu={handleRightClick}
      onClick={handleClick}
      className={`relative ${
        !menuOpen ? "cursor-pointer" : ""
      } w-full h-[120px] flex flex-col bg-[hsl(0 0% 100%)] border border-accent  rounded-md p-4 hover:bg-accent transition-all duration-150`}
    >
      {menuOpen && <ControlMenu handleDelete={handleDelete} />}
      {!menuOpen && (
        <>
          <h3>{categoryId}</h3>
          <p>{name.length > 70 ? name.slice(0, 69).concat(" .....") : name}</p>
        </>
      )}
    </div>
  );
};
