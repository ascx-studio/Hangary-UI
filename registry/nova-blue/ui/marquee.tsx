"use client";

import * as motion from "motion/react-client";
import { useMemo } from "react";
import { language } from "../../lib/portfolio/skills-data";
import LanguageCard from "../../components/portfolio/cards/language-card";
import { cn } from "../../lib/portfolio/utils";

function Marquee({ className }: { className?: string } = {}) {
  const tripleLang = useMemo(() => [...language, ...language], []);

  return (
    <div
      className={cn(
        "relative border border-white/10 overflow-hidden bg-black/40 mb-10",
        className,
      )}
    >
      <motion.div
        className="flex w-fit"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {tripleLang.map((item, idx) => (
          <LanguageCard
            className="w-56"
            key={`${item.label}-${idx}`}
            skill={item}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default Marquee;
