"use client";

import * as motion from "motion/react-client";
import { ArrowRight } from "lucide-react";
import { navlink as quicklink } from "../../lib/portfolio/data/navlink";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:hidden absolute top-full left-0 w-full bg-[#030303]/95 backdrop-blur-xl border-t border-white/10 overflow-hidden shadow-2xl"
    >
      <div className="flex flex-col space-y-4 p-6">
        {quicklink.map((link) => (
          <motion.a
            key={link.id}
            href={link.url}
            className="flex items-center text-lg font-medium text-zinc-400 hover:text-white transition-colors"
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            {link.title}
          </motion.a>
        ))}
        <motion.a
          href="mailto:contact@rajeevpuri.com.np"
          className="flex items-center pt-4"
          onClick={onClose}
        >
          <button className="w-full bg-white text-black px-6 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95">
            Lets Talk <ArrowRight size={16} />
          </button>
        </motion.a>
      </div>
    </motion.div>
  );
}
