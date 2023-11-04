import { redirect } from "next/navigation";
import { FC } from "react";
import { CreateOrg } from "../organization/_components/create-org";
import { getServerSession } from "next-auth";
import getCurrentUser from "@/actions/getCurrentuser";
// import CreateOrg from "./_components/create-org";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  const user = await getCurrentUser();
  console.log(user);
  return (
    <>
      <div className="min-h-screen">
        Settings Page <br />
        {session.user?.name}
        {/* {user.userType === "CORETEAM" && <CreateOrg />} */}
      </div>
    </>
  );
};

export default page;
