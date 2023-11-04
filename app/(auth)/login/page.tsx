import AuthForm from "@/components/auth-form";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <AuthForm />
      </div>
    </>
  );
};

export default page;
