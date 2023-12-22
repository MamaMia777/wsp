"use client";
import { IUser } from "@wsp/app/utils";
import FrameWrapper from "./FrameWrapper";
import { useMutation, useQuery } from "react-query";
import Api from "@wsp/app/utils/api";
import { Button } from "@wsp/app/ui";
import React, { useState } from "react";
import Image from "next/image";
import { UserContext } from "../../providers/UserProvider";

interface IUserRecord {
  user: IUser;
  refetch: any;
}

const UserMenu = ({
  email,
  refetch,
  setMenu,
}: {
  email: string;
  refetch: any;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const options = [
    { label: "Grant Admin rights", value: "admin" },
    { label: "Delete", value: "delete" },
  ];
  const { mutate: deleteUser } = useMutation(
    () => Api().usersApi.deleteUser(email),
    {
      onSuccess: () => {
        refetch({
          queryKey: "users",
        });
        setMenu(false);
      },
      onError: (err) => {
        console.log(err);
      },
      onSettled: () => {},
    }
  );
  const { mutate: grantAdminRights } = useMutation(
    () => Api().usersApi.grantAdminRights(email),
    {
      onSuccess: () => {
        refetch({
          queryKey: "users",
        });
        setMenu(false);
      },
      onError: (err) => {
        console.log(err);
      },
      onSettled: () => {},
    }
  );
  return (
    <div className="w-[200px] absolute top-[100%] right-0 mt-1 p-2 flex-col flex rounded-md bg-[white] gap-2 z-[1000] shadow-xl border">
      {options.map((option) => {
        return (
          <div
            key={option.value}
            onClick={() => {
              if (option.value === "delete") {
                deleteUser();
              } else if (option.value === "admin") {
                grantAdminRights();
              }
            }}
            className="px-4 py-2 text-[black] text-[1rem] cursor-pointer hover:bg-accent rounded-md "
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};
const UserRecord: React.FC<IUserRecord> = ({ user, refetch }) => {
  const clientUser = React.useContext(UserContext);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="mt-4 text-[black] text-[1rem] flex  items-center  gap-7">
      <Image
        src={user.imageUrl}
        width={35}
        height={35}
        alt={user.email}
        className="rounded-full"
      />
      <span className="justify-start align-left">{user.email}</span>
      <div className="relative ml-auto">
        <div
          onClick={() => {
            setOpenMenu((prev) => !prev);
          }}
          className="border rounded-md px-2 py-1 cursor-pointer"
        >
          {user.role}
        </div>
        {openMenu && clientUser.email !== user.email && (
          <UserMenu
            email={user.email}
            refetch={refetch}
            setMenu={setOpenMenu}
          />
        )}
      </div>
    </div>
  );
};

const UserControlPanel = () => {
  const [newEmail, setNewEmail] = useState("");
  const { data, refetch } = useQuery({
    queryKey: "users",
    queryFn: () => Api().usersApi.getUsers(),
  });
  const { mutate: postNewUser } = useMutation(
    () => Api().usersApi.createUser(newEmail),
    {
      onSuccess: () => {
        refetch({
          queryKey: "users",
        });
        setNewEmail("");
      },
      onError: (err) => {
        console.log(err);
      },
      onSettled: () => {},
    }
  );
  const handleUserCreation = () => {
    postNewUser();
  };
  return (
    <FrameWrapper>
      <div className="h-[30px] w-full flex gap-2 mb-4">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border rounded-md w-3/4 px-2"
          placeholder="new@gmail.com"
        />
        <Button
          className="h-[30px] w-1/4"
          disabled={newEmail.length === 0}
          onClick={handleUserCreation}
        >
          Add
        </Button>
      </div>
      <h1>Users</h1>
      {data?.map((user) => (
        <UserRecord key={user.email} user={user} refetch={refetch} />
      ))}
    </FrameWrapper>
  );
};
export default UserControlPanel;
