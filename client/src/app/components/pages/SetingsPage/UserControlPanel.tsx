"use client";
import { IUser } from "@wsp/app/utils";
import FrameWrapper from "./FrameWrapper";
import { useQuery } from "react-query";
import Api from "@wsp/app/utils/api";
import { Button } from "@wsp/app/ui";

const UserRecord = ({ email, role }: IUser) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value;

    switch (method) {
      case "ADMIN":
        break;
      case "USER":
        break;
      case "DELETE":
        break;
    }
  };
  return (
    <div className="mt-4 text-[1.1rem] flex gap-7 justify-between">
      <span>{email}</span>
      <select value={role}>
        <option value="ADMIN">ADMIN</option>
        <option value="USER">USER</option>
        <option value="USER">DELETE</option>
      </select>
    </div>
  );
};

const UserControlPanel = () => {
  const { data } = useQuery({
    queryKey: "users",
    queryFn: () => Api().usersApi.getUsers(),
  });

  return (
    <FrameWrapper>
      <h1>Users</h1>
      {data?.map((user) => (
        <UserRecord email={user.email} role={user.role} />
      ))}
      <Button className="w-full mt-4 ">+ Add user</Button>
    </FrameWrapper>
  );
};
export default UserControlPanel;
