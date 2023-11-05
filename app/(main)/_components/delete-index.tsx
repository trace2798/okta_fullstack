"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FC } from "react";

interface DeleteIndexProps {}

const handleClick = async () => {
  const response = await axios.post("/api/deleteindex");
  // console.log(response);
};

const DeleteIndex: FC<DeleteIndexProps> = ({}) => {
  return (
    <>
      <Button onClick={handleClick}>Deleted Index</Button>
    </>
  );
};

export default DeleteIndex;
