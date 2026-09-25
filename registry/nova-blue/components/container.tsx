import { cn } from "../../lib/portfolio/utils";
import * as motion from "motion/react-client";
import { ReactNode } from "react";

interface ContainerProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variants?: any;
  initial?: any;
  animate?: any;
  transition?: any;
}

export default function Container({
  id,
  children,
  className,
  variants,
  initial = "hidden",
  animate = "visible",
  transition,
}: Readonly<ContainerProps>) {
  return (
    <motion.section
      id={id}
      className={cn(className, "max-w-6xl mx-auto overflow-x-hidden")}
      variants={variants}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.section>
  );
}
