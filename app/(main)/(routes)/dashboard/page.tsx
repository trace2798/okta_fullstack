import { db } from "@/lib/db";
import { FC } from "react";
import { DocumentCard } from "../../_components/document-card";
import getCurrentUser from "@/actions/getCurrentuser";
import { redirect } from "next/navigation";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  let documents;
  if (user.userType === "ENTERPRISE") {
    if (user.active) {
      documents = await db.file.findMany({
        where: {
          orgId: user.orgId,
        },
      });
    } else {
      return (
        <>
          <div className="min-h-screen flex flex-wrap justify-evenly space-y-3 space-x-3">
            <p>You do not have access to files.</p>
          </div>
        </>
      );
    }
  } else {
    documents = await db.file.findMany({
      where: {
        userId: user.id,
      },
    });
  }
  return (
    <>
      <div className="min-h-screen flex flex-wrap justify-evenly space-y-3 space-x-3">
        {documents.map((doc, index) => (
          <DocumentCard key={index} file={doc} />
        ))}
      </div>
    </>
  );
};

export default page;
