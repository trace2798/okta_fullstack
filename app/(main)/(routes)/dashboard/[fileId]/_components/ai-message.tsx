"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { FC } from "react";

interface AIMessageProps {
  text: string;
}

const AIMessage: FC<AIMessageProps> = ({ text }) => {
  const { toast } = useToast();
  const onCopy = () => {
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text);
    toast({
      description: "Message copied to clipboard.",
      duration: 3000,
    });
  };
  return (
    <>
      <div className="text-green-500 p-4 w-full flex items-start gap-x-8 rounded-lg max-w-lg bg-muted group">
        {text}
        <Button
          onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 transition"
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default AIMessage;
