"use client";
import { createContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import Api from "@wsp/app/utils/api";
import { useRouter } from "next/navigation";
export const UserContext = createContext<any>({});
export default function UserProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<any>();
  const history = useRouter();
  useEffect(() => {
    const token = parseCookies()["WSP_AUTHORIZATION_COOKIE"];
    if (token) {
      Api()
        .usersApi.getMe()
        .then((res) => {
          setUser(res);
          // history.push("/");
        })
        .catch((err) => {
          history.push("/login");
        });
    } else {
      history.push("/login");
    }
  }, []);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
