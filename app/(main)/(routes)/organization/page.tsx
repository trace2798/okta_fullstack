import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { FC } from "react";
import { CreateOrg } from "./_components/create-org";
import getCurrentUser from "@/actions/getCurrentuser";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const user = await getCurrentUser();
  if (!user || user.userType != "CORETEAM") {
    redirect("/dashboard");
  }
  const orgs = await db.org.findMany({});
  // console.log(orgs);
  return (
    <>
      <div className="min-h-screen">
        <CreateOrg />
        {orgs.map((org, index) => (
          <>
            <Card key={index} className="bg-inherit mt-3 max-w-sm p-5">
              <CardTitle>{org.name}</CardTitle>
              <CardDescription>{org.id}</CardDescription>
            </Card>
          </>
        ))}
      </div>
    </>
  );
};

export default page;
