import React from "react";

interface HoverContentComponentProps {
  type: string;
  
}

export const HoverContentComponent: React.FC<HoverContentComponentProps> = ({
  type,
  
}) => {
  return (
    <div className="text-left">
      <p className="py-2">
        <span className="text-zinc-700 dark:text-neutral-400">{type}</span>
      </p>
     
    </div>
  );
};