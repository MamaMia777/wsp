"use client";
import { Button, Input } from "@wsp/app/ui";
import Image from "next/image";
import { CategoryCard, PopUpBlur } from "..";
import { useQuery } from "react-query";
import Api from "@wsp/app/utils/api";
import { useEffect, useState } from "react";
import { ICategoryBasic } from "@wsp/app/utils";
import AddCategoryModal from "../modals/AddCategoryModal";
const MainPage = () => {
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategoryBasic[]>([]);

  const handleWindowClose = () => setAddCategory(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: "categories",
    queryFn: () => Api().categories.getCategories(),
  });

  useEffect(() => {
    if (data) setCategories(data);
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    const { value } = e.target;
    if (value.length > 0) {
      setCategories((prev) =>
        data.filter((el) => {
          return (
            el.name.toLowerCase().includes(value.toLowerCase()) ||
            el.categoryId.toLowerCase().includes(value.toLowerCase())
          );
        })
      );
    } else {
      setCategories(data ? data : []);
    }
  };

  return (
    <section className="page">
      {addCategory && (
        <PopUpBlur>
          <AddCategoryModal onClose={handleWindowClose} refetch={refetch} />
        </PopUpBlur>
      )}
      <div className="w-full flex justify-between items-center">
        <h1>Overview</h1>
        <Button onClick={() => setAddCategory(true)}>
          <Image
            className=" fill-[white]"
            src={"/ui/Plus.svg"}
            width={16}
            height={16}
            alt={"Add"}
          />
          Add category
        </Button>
      </div>
      <div>
        <Input placeholder="Search...." onChange={handleSearch} />
      </div>
      <div className="grid grid-cols-5 gap-5 pt-6">
        {(isLoading || !!error || !categories) &&
          new Array(20).fill(0).map((el, idx) => {
            return (
              <div
                key={idx}
                className="w-full h-[120px] bg-accent animate-pulse rounded"
              ></div>
            );
          })}
        {categories &&
          categories.map((el) => (
            <CategoryCard
              name={el.name}
              key={el.categoryId}
              categoryId={el.categoryId}
            />
          ))}
      </div>
    </section>
  );
};
export default MainPage;
