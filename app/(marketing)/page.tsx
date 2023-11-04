"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AnimatedButton from "./_components/animated-button";
import { useSession } from "next-auth/react";

export default function Home() {
  const user = useSession();
  console.log(user);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 mt-32 md:mt-0 md:p-24">
      <div className="xl:my-12 md:my-20 md:mx-[5vw] lg:mx-[10vw] xl:mx-[15vw] flex flex-col items-center justify-between">
        <AnimatedButton />
        <div className="mt-5">
          <h1 className=" text-5xl md:text-9xl font-satoshiBlack bg-gradient-to-r bg-clip-text text-transparent from-neutral-200 to-zinc-900 animate-heading">
            converse.ai
          </h1>
          <h2 className="text-2xl md:text-3xl font-satoshiBold mt-10">
            Take to your documents
          </h2>
          <h3 className="text-xl mt-5 font-ranadeRegular">
            This is my submission for{" "}
            <a
              href="https://hashnode.com/hackathons/outerbase"
              target="_blank"
              className="text-lg md:text-2xl hover:underline font-satoshiBlack bg-gradient-to-r bg-clip-text text-transparent from-yellow-500 via-purple-500 to-red-500 animate-text"
            >
              Okta Identity and AI
            </a>{" "}
            hackathon 2023.{" "}
          </h3>

          {!user || !user.data ? (
            <a href="/login">
              <Button variant={"default"} className="mt-4">
                Get Started
              </Button>
            </a>
          ) : (
            <a href="/dashboard">
              <Button variant={"default"} className="mt-4">
                Dashboard {user.data?.user?.email}
              </Button>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
