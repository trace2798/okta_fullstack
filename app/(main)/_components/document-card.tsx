import * as React from "react";

import { TrashBox } from "@/components/trash-box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { File } from "@prisma/client";
import axios from "axios";
import IndexButton from "./index-button";
import Link from "next/link";

interface DocumentCardProps {
  file: File;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ file }) => {
  const handleIndex = async () => {
    await axios.post("/api/index", { file });
  };
  return (
    <Card className="w-[350px] h-fit">
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
        {/* <CardDescription>{file.name}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="upload status">
              Upload Status: {file.uploadStatus}
            </Label>
            <Label htmlFor="Index status">
              Index: {file.indexStatus ? "Done" : "Not Done"}
            </Label>
            <Label htmlFor="Page Amount">Page Amount: {file.pageAmt}</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {file.indexStatus ? (
          <>
            <Link href={`dashboard/${file.id}`}>Chat</Link>
            <TrashBox file={file} />
            {/* <DeleteIndex /> */}
          </>
        ) : (
          <>
            <IndexButton file={file} />
            <TrashBox file={file} />
          </>
        )}
      </CardFooter>
    </Card>
  );
};
