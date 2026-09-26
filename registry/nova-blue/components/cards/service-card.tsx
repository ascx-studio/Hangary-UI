import { cn } from "../../lib/utils";
import { Activity, ChevronRightIcon, Layers } from "lucide-react";
import * as motion from "motion/react-client";

interface ServiceCardProps {
  service: any;
  index: number;
  className?: string;
}

const ServiceCard = ({ service, index,className }: ServiceCardProps) => {
  const code = `[0${String(index + 1)}]`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        className,
        "group relative flex flex-col border border-zinc-800 bg-black transition-all duration-300 hover:border-primary overflow-hidden ",
      )}
    >
      {/* Visual Header / Illustration Slot */}
      <div className="relative flex-1 min-h-40 p-6 flex items-center justify-center bg-zinc-900/10 overflow-hidden">
        <div className="  transition-all duration-500 group-hover:scale-110 z-10">
          {service.illustration || (
            <Layers
              size={40}
              className="text-zinc-800 group-hover:text-primary transition-colors duration-300"
            />
          )}
        </div>
        {/* Decorative Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"
          style={{
            backgroundImage: "radial-gradient(#2883ff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Scanning Overlay Effect */}
        <div className="absolute top-0 left-0 w-full h-px bg-accent-purple/30 -translate-y-full group-hover:animate-[scan_3s_linear_infinite]" />
      </div>

      <div className="flex flex-col p-5 bg-black border-t border-zinc-800 group-hover:border-accent-purple/50 transition-colors">
        <div className="mb-4 flex items-center gap-2 ">
          <span className="font-mono inline-block bg-white text-black px-3 py-1 text-[10px] font-bold tracking-widest uppercase w-fit">
            {code}
          </span>
          <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            {service.category}
          </span>
          <Activity
            size={10}
            className="text-zinc-800 group-hover:text-primary transition-colors duration-300"
          />
        </div>

        <h3 className="text-xl md:text-2xl font-bold leading-tight text-white group-hover:text-blue-400 transition-colors duration-300">
          {service.title}
        </h3>

        {/* <p className="text-zinc-500 text-base leading-relaxed group-hover:text-zinc-300 transition-colors duration-300 min-h-20 line-clamp-2">
          {service.description}
        </p> */}

{/*
        <div className="hidden lg:flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-900">
          <div className="flex flex-wrap gap-2">
            {service.technologies.map((tech: string, idx: number) => (
              <span
                key={idx}
                className="inline-block px-3 py-1 text-[10px] text-zinc-500 border border-zinc-800 bg-zinc-900/50 font-mono uppercase tracking-wider group-hover:border-blue-500/20 group-hover:text-blue-300 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div> */}
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRightIcon size={14} className="text-primary" />
      </div>
    </motion.div>
  );
};

export default ServiceCard;
