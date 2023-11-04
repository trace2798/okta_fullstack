import { db } from "@/lib/db";
import Navbar from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import getCurrentUser from "@/actions/getCurrentuser";
import { redirect } from "next/navigation";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  const user = await db.user.findFirst({
    where: {
      email: currentUser?.email,
    },
  });
  if (!user) {
    redirect("/");
  }
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <Navbar />
      <div className="hidden md:flex mt-16 h-full w-20 flex-col fixed inset-y-0">
        <Sidebar userType={user.userType} />
      </div>
      <main className="pl-[10vw] pr-[5vw] lg:px-[5vw] pt-24 h-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
