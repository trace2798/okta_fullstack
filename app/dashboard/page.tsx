"use client";
import { Button } from "@/components/ui/button";
import { getSession, signOut } from "next-auth/react";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getSession();
  console.log(session);
  return (
    <>
      <Button onClick={() => signOut()}>Log Out</Button>
    </>
  );
};

export default page;
