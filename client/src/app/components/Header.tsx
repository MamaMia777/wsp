"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Overview", href: "" },
  { label: "Settings", href: "settings" },
];

const Header = () => {
  const path = usePathname();
  const hideHeader =
    path.split("/").reverse()[0] === "login" ||
    path.split("/").reverse()[0] === "/signup";
  return (
    <>
      {!hideHeader && (
        <div className=" w-full flex justify-between py-3 border-b-2 border-b-[solid red] page h-[60px]">
          <div className="flex gap-6 items-center">
            <span className="font-bold text-[black]">WSP/eis</span>
            {LINKS.map((el) => (
              <Link href={`/${el.href}`} key={el.label}>
                <span
                  className={`${
                    path.split("/").reverse()[0] === el.href.toLowerCase()
                      ? "font-bold text-[black]"
                      : ""
                  }`}
                >
                  {el.label}
                </span>
              </Link>
            ))}
          </div>
          <div>
            <Image
              src={"https://avatar.iran.liara.run/public/22"}
              width={40}
              height={40}
              alt="wsp"
            />
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
