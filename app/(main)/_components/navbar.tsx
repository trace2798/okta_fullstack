import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import UserAccountNav from "@/components/user-account-nav";
import LoginButton from "../../../components/login-button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { MobileSidebar } from "./mobile-sidebar";
import getCurrentUser from "@/actions/getCurrentuser";
import { redirect } from "next/navigation";
import Upgrade from "./upgrade-button";

const font = Poppins({ weight: "600", subsets: ["latin"] });

const Navbar = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }
  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 dark:bg-zinc-900">
      <div className="flex items-center">
        <MobileSidebar userType={user?.userType} />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            converse.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {/* {userId && <SearchSheet />} */}
        <ModeToggle />
        {!user ? (
          <LoginButton />
        ) : (
          <UserAccountNav
            name={!user.name ? "Your Account" : `${user.name}`}
            email={user.email ?? ""}
            imageUrl={user.imageUrl ?? ""}
          />
        )}
        {user.userType === "FREE" && <Upgrade />}
      </div>
    </div>
  );
};

export default Navbar;
