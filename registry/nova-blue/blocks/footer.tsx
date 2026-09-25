import * as motion from "motion/react-client";
import { navlink as quicklink } from "../../lib/portfolio/data/navlink";
import { Mail } from "lucide-react";
import Container from "../../components/portfolio/container";
import { Suspense } from "react";
import { currentYear } from "../../lib/portfolio/utils";
import Image from "next/image";


function Footer() {
 const llms = [
   {
     id: "llms-file",
     title: "llms.txt",
     url: "/llms.txt",
     icon: "llms.txt",
     hoverColor: "hover:text-blue-400",
     bgColor: "bg-blue-400/10",
     description: "Explore the llms.txt file...",
   },
 ];
  return (
    <footer className="mt-20 border-t border-zinc-900  selection:bg-blue-600 selection:text-white overflow-hidden">
      <div className="h-0.5 bg-linear-to-r from-transparent via-accent-purple/35 to-transparent w-full" />

      <Container>
        <ShipItCTA />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-zinc-900">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 space-y-6 border-b md:border-b-0 md:border-r border-zinc-900"
          >
            <Image
              src="/portfolio/lettermark.svg"
              width={162}
              height={46}
              alt="lettermark"
              className="h-8 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Building immersive digital experiences optimized for speed and
              accessibility. Specializing in conversion-focused design and
              robust software engineering.
            </p>
            <a
              href="mailto:contact@rajeevpuri.com.np"
              className="inline-flex items-center text-white hover:text-blue-400 transition-colors duration-300 group"
            >
              <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">
                contact@rajeevpuri.com.np
              </span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8  space-y-6 border-b md:border-b-0 border-border"
          >
            <h3 className="text-white text-xl font-semibold">Quick Links</h3>
            <nav className="grid grid-cols-2 gap-2">
              {[...quicklink, ...llms].map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 4 }}
                >
                  <span>{link.title}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>


        </div>

        <div className="px-8  py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Suspense>
              <p className="text-gray-400 text-xs md:text-sm">
                &copy; {currentYear} Rajeev Puri. All rights reserved.
              </p>
            </Suspense>

            <nav className="flex gap-4 flex-wrap justify-center md:justify-end">
              {[...quicklink, ...llms].map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 4 }}
                >
                  <span>{link.title}</span>
                </motion.a>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function ShipItCTA() {
  return (
    <section className="py-2 group overflow-hidden border-b border-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 text-5xl sm:text-6xl md:text-7xl lg:text-9xl"
      >
        <h2 className="font-black tracking-wide leading-tight md:leading-none select-none transition-all duration-700 ">
          <span className="text-white block md:inline md:mx-2">SAY IT.</span>

          <span className="text-zinc-800 block md:inline md:mx-2">SHARE IT.</span>

          <span className="text-blue-600 block md:inline md:mx-2">SHIP IT.</span>
        </h2>
      </motion.div>
    </section>
  );
}

export default Footer;
