import { FC } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface LoginButtonProps {}

const LoginButton: FC<LoginButtonProps> = ({}) => {
  return (
    <>
      <Link href="/api/auth/login">
        <Button variant="ghost">Login</Button>
      </Link>
    </>
  );
};

export default LoginButton;
