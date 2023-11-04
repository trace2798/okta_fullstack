import {
    motion
} from "framer-motion";
import { FC } from "react";

interface AnimatedButtonProps {}

const AnimatedButton: FC<AnimatedButtonProps> = ({}) => {
  return (
    <>
      <div className="p-[1px] bg-transparent relative">
        <div className="p-2 ">
          <span className="absolute inset-0 px-3 rounded-3xl overflow-hidden">
            <motion.span
              className="w-[500%] aspect-square absolute bg-[conic-gradient(from_0deg,transparent_0_340deg,blue_360deg)] opacity-20"
              initial={{
                rotate: -90,
              }}
              animate={{
                rotate: 90,
              }}
              transition={{
                duration: 3.8,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                translateX: "-50%",
                translateY: "-10%",
                zIndex: -1,
              }}
            />
          </span>
          <span className="bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-700 font-ranadeRegular">
            converse.ai is on private beta
          </span>
        </div>
      </div>
    </>
  );
};

export default AnimatedButton;
