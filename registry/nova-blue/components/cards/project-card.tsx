import { projectPlaceholder } from "../../lib/project-placeholder";
import * as motion from "motion/react-client";
import Image from "next/image";
import {
  ReactLight,
  Nodejs,
  Python,
  Docker,
  Redux,
  TailwindCSS,
  MotionDark,
  Vite,
  Java,
  TypeScript,
  Nextjs,
  Supabase,
  Vue,
  MongoDBDark,
} from "@ridemountainpig/svgl-react";
import { Database } from "lucide-react";

interface TechItem {
  id: string;
  icon: React.ReactNode;
}

function renderTechIcon(name: string) {
  const normalized = name.trim().toLowerCase();

  if (normalized === "next.js" || normalized === "nextjs") {
    return <Nextjs width={24} height={24} className="text-[#000000] dark:text-white" />;
  }
  if (normalized === "react") {
    return <ReactLight width={24} height={24} className="text-[#61DAFB]" />;
  }
  if (normalized === "tailwind css" || normalized === "tailwind") {
    return <TailwindCSS width={24} height={24} className="text-[#06B6D4]" />;
  }
  if (normalized === "typescript") {
    return <TypeScript width={24} height={24} className="text-[#3178C6]" />;
  }
  if (normalized === "framer motion") {
    return <MotionDark width={24} height={24} className="text-[#0055FF]" />;
  }
  if (normalized === "python") {
    return <Python width={24} height={24} className="text-[#3776AB]" />;
  }
  if (normalized === "docker") {
    return <Docker width={24} height={24} className="text-[#2496ED]" />;
  }
  if (normalized === "supabase") {
    return <Supabase width={24} height={24} className="text-[#3ECF8E]" />;
  }
  if (normalized === "java") {
    return <Java width={24} height={24} className="text-[#ED8B00]" />;
  }
  if (normalized === "database") {
    return <Database size={24} className="text-[#4DB33D]" />;
  }
  if (normalized === "node.js" || normalized === "nodejs") {
    return <Nodejs width={24} height={24} className="text-[#339933]" />;
  }
  if (normalized === "mongodb") {
    return <MongoDBDark width={24} height={24} className="text-[#47A248]" />;
  }
  if (normalized === "express") {
    return <Nodejs width={24} height={24} className="text-white" />;
  }
  if (normalized === "redux") {
    return <Redux width={24} height={24} className="text-[#764ABC]" />;
  }
  if (normalized === "vite") {
    return <Vite width={24} height={24} className="text-[#646CFF]" />;
  }
  if (normalized === "vue") {
    return <Vue width={24} height={24} className="text-[#4FC08D]" />;
  }

  return <Database size={24} className="text-slate-300" />;
}

interface ProjectProps {
  title: string;
  description: string;
  link: string;
  tech: Record<string, TechItem | undefined>;
  image?: string;

}

const Project = ({
  title,
  description,
  link,
  tech,
  image,
}: ProjectProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className=" group transition-colors  duration-normal flex items-center hover:bg-white/2 p-4 border-border border hover:border-primary/50"
    >
      <div className="space-y-4 ">

          <Image
            src={image || projectPlaceholder}
            loading="eager"
            alt={`Screenshot of ${title} project`}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out group-hover:shadow-lg"
          />

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-zinc-100 transition-colors">
            {title}
          </h3>
        </a>
        <p className="text-xs font-normal text-zinc-400 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="pt-3 flex items-center justify-between border-t border-zinc-900 text-xs text-zinc-400 font-mono">

          <div className="flex items-center space-x-1">
            {Object.values(tech)
              .filter((item): item is TechItem => item !== undefined)
              .slice(0, 3)
              .map((item, idx) => (
                <div
                  key={idx}
                  title={item.id}
                  className="p-1.5  bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors"
                >
                  {item.icon ?? renderTechIcon(item.id)}
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Project;
