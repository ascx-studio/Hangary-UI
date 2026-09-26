import * as motion from "motion/react-client";
import Link from "next/link";
import dynamic from "next/dynamic";
import Container from "../components/container";
import Socialicons from "../ui/socialicons";
import CopyCommand from "../ui/copy-command";
import Marquee from "../ui/marquee";
import { Suspense } from "react";

const TopographicCanvas = dynamic(
  () =>
    import("../backgrounds/topographic").then((mod) => mod.TopographicCanvas)
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  },
};



export default function Hero() {
  const param = {
    numContours: 18,
    timeSpeed: 0.12,
    noiseScale: 0.002,
    colorScheme: "amber" as const,
    showLabels: true,
    showGrid: false,
    mouseInfluence: false,
    hueRotate: 175,
  };

  return (
    <>
      <Container id="home" className="w-full p-4 md:p-5 mx-auto">
        <Suspense>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="hidden md:block absolute inset-0 z-0"
          >
            <TopographicCanvas {...param} />
            <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-[#030303] via-[#030303]/80 to-transparent w-full" />
          </motion.div>
        </Suspense>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 md:space-y-12 relative z-10"
        >
          <div className="flex items-center min-h-screen md:min-h-[90dvh] py-12 md:py-0">
            <div className="w-full max-w-3xl">


              <motion.h1
                variants={itemVariants}
                className="text-7xl  md:text-8xl l font-medium tracking-tight leading-[0.95] mb-6 md:mb-8"
              >
                Relearn how to <br />
                wonder, feel, and{" "}
                <motion.span


                  className="mr-2 text-primary"
                >
                  Build 10X.
                </motion.span>
              </motion.h1>



              <motion.p
                variants={itemVariants}
                className="text-[8px] md:text-[10px] text-zinc-400 font-medium mb-8 md:mb-10 uppercase tracking-widest hover:text-white transition-colors duration-300"
              >
                No deadlines — No noise — Just space to rediscover your
                imagination
              </motion.p>

              <motion.div variants={itemVariants}>
                <Socialicons showLabel className="mb-6 md:mb-8" />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex w-full gap-6 mb-8 md:mb-12"
              >
                <Link
                  href="/projects"
                  className="group relative flex items-center justify-center md:justify-start gap-3 text-xs px-6 md:px-10 py-4 md:py-5 border border-white/20 bg-transparent font-black uppercase tracking-[0.2em] hover:border-white transition-all overflow-hidden"
                >
                  <span className="relative z-10">VIEW PROJECTS</span>
                  <motion.div
                    className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 md:px-10 py-4 md:py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-zinc-200 border border-white flex items-center justify-center"
                >
                  CONTACT
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="max-w-xl mb-8 md:mb-12 ">
                <CopyCommand
                  command="curl -L https://rajeevpuri.com.np"
                  label="View in terminal"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
      <Marquee />
    </>
  );
}
