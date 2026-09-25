import * as motion from "motion/react-client";
import type { ComponentType } from "react";

type ProcessCardProps = {
  step: string | number;
  title: string;
  detail: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  status: string;
};

export default function ProcessCard({
  step,
  title,
  detail,
  icon: Icon,
  status,
}: Readonly<ProcessCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group h-full"
    >
      <div className="relative h-full border border-white/10 p-8 hover:border-blue-500/50 bg-zinc-900/5 hover:bg-zinc-900/20 transition-all duration-500 flex flex-col gap-6 overflow-hidden">
        {/* Background Step Number */}
        <span className="absolute -top-4 -right-4 text-9xl font-black text-white/2 group-hover:text-blue-500/3 transition-colors pointer-events-none select-none">
          {step}
        </span>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform duration-500">
              {Icon ? <Icon size={24} /> : null}
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-mono font-bold text-zinc-500 tracking-[0.2em] uppercase">
                Step {step}
              </p>
              <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
            </div>
          </div>
          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-400 border border-zinc-700 group-hover:border-blue-500/30 group-hover:text-blue-300 transition-all">
            {status}
          </span>
        </div>

        <div className="relative flex-1 py-4 border-t border-white/5 mt-2">
          <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors text-sm">
            {detail}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-auto flex justify-between items-center pt-6 border-t border-white/5">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                  i <= Number(step)
                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    : "bg-zinc-800"
                }`}
              ></div>
            ))}
          </div>
          <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
            PHASE {step}_COMPLETE
          </span>
        </div>
      </div>
    </motion.div>
  );
}
