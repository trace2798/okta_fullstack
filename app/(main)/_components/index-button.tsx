"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { File } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface IndexButtonProps {
  file: File;
}

const IndexButton: FC<IndexButtonProps> = ({ file }) => {
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit = async () => {
    try {
    //   const url = file.url;
      const response = await axios.post(`/api/index`, { file});
      console.log(response);
      router.refresh();
      toast({
        title: "Image Generated",
        description: "Image based on your input has been generated",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          return toast({
            title: "You are out of token.",
            variant: "destructive",
          });
        }
      } else {
        console.error(error);
        toast({
          title: "Oops something went wrong",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <>
      {file.indexStatus ? (
        <h1>File successfully indexed</h1>
      ) : (
        <Button onClick={onSubmit}>Index File</Button>
      )}
    </>
  );
};

export default IndexButton;
