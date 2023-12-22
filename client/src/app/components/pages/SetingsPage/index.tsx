"use client";
import React from "react";
import UserControlPanel from "./UserControlPanel";
import { UserContext } from "../../providers/UserProvider";

const SettingPage = () => {
  const user = React.useContext(UserContext);
  return <div>{user && user.role === "ADMIN" && <UserControlPanel />}</div>;
};
export default SettingPage;
