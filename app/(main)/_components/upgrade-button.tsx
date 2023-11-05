"use client";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { FC } from "react";

interface UpgradeProps {}

const Upgrade: FC<UpgradeProps> = ({}) => {
  const proModal = useProModal();
  return (
    <>
      <Button onClick={proModal.onOpen} size="sm" variant="ghost">
        Upgrade
      </Button>
    </>
  );
};

export default Upgrade;
