"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Api from "@wsp/app/utils/api";

const Social = () => {
  const history = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      Api()
        .usersApi.googleLogin(code)
        .then(() => {
          history.push("/");
        });
    }
  }, []);

  return <></>;
};
export default Social;
