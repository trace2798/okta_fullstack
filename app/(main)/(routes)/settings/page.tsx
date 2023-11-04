import { getUserInfo } from "@/lib/get-user-info";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { FC } from "react";
import { CreateOrg } from "../organization/_components/create-org";
// import CreateOrg from "./_components/create-org";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  const user = await getUserInfo();
  console.log(user);
  return (
    <>
      <div className="min-h-screen">
        Settings Page <br />
        {session.user.sub}
        {/* {user.userType === "CORETEAM" && <CreateOrg />} */}
      </div>
    </>
  );
};

export default page;
