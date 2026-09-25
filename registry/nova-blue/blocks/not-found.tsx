
import Link from "next/link";
import * as motion from "motion/react-client";

import { cn } from "../../lib/portfolio/utils";
import Container from "../../components/portfolio/container";

export function NotFound({ className }: Readonly<{ className?: string }>) {

  return (
    <Container
      className={cn(
        "min-h-screen px-6 py-24 sm:px-10 lg:px-12 flex items-center justify-center mx-auto ",
        className,
      )}
    >
      <div className="text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.8] mb-4 text-white"
        >
          404 <span className="text-primary">ERROR</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="max-w-2xl text-zinc-500 text-lg md:text-xl font-medium tracking-tight border-l-2 border-white/10 pl-6 leading-relaxed mt-10">
            Oops... this page seems to have wandered off. It might have been
            moved, renamed, or decided to take a vacation in a different subnet.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-8 md:mb-12 mt-12"
        >
          <Link
            href="/"
            className="group flex items-center justify-center gap-3 text-xs px-10 py-5 border-2 border-white/10 bg-transparent text-white font-black uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Back to Home
          </Link>
          <Link
          href="/contact"
            className="px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 active:scale-95 border-2 border-white flex items-center justify-center gap-3 hover:bg-primary hover:border-primary hover:text-white"
          >
            Contact now
          </Link>
        </motion.div>

      </div>
    </Container>
  );
}
