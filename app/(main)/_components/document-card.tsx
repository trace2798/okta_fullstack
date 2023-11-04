import * as React from "react";

import { TrashBox } from "@/components/trash-box";
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
import Link from "next/link";
import IndexButton from "./index-button";

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
        {file.uploadStatus === "SUCCESS" && (
          <>
            {file.indexStatus ? (
              <Link href={`dashboard/${file.id}`}>Chat</Link>
            ) : (
              <IndexButton file={file} />
            )}
          </>
        )}
        <TrashBox file={file} />
      </CardFooter>
    </Card>
  );
};
