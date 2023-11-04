import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getUserInfo } from "@/lib/get-user-info";
import { getSession } from "@auth0/nextjs-auth0";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Chat } from "./_components/chat";

interface FileIdPageProps {
  params: {
    fileId: string;
  };
}

const FileIdPage = async ({ params }: FileIdPageProps) => {
  const session = await getSession();
  const user = await getUserInfo();
  if (!session) {
    redirect("/");
  }
  if (session.user.sub !== user.authId) {
    redirect("/");
  }
  const file = await db.file.findFirst({
    where: {
      id: params.fileId,
      userId: user.id,
    },
  });
  if (!file) {
    return (
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch h-[88vh] md:min-h-screen justify-center text-center">
        <h1>File could not be found</h1>
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: "secondary",
            className: "mt-4",
          })}
        >
          <ChevronLeft className="h-3 w-3 mr-1.5" />
          Back
        </Link>
      </div>
    );
  }
  const messages = await db.message.findMany({
    where: {
      AND: [
        {
          fileId: params.fileId,
        },
        {
          userId: user.id,
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return (
    <>
      <Chat fileId={params.fileId} pastMessages={messages} userId={user.id} />
    </>
  );
};

export default FileIdPage;
