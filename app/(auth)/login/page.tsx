import AuthForm from "@/components/auth-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <a href="/">
        <Button variant="ghost" className="mt-3">
          {" "}
          <ChevronLeft /> Back Home
        </Button>
      </a>

      <div className="h-screen flex justify-center items-center">
        <AuthForm />
      </div>
    </>
  );
};

export default page;
