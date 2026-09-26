import { cn } from "../../lib/utils";

type Skill = {
  icon: React.ReactNode;
  label: string;
};

type SkillCardProps = {
  skill: Skill;
  className?: string;
};

export default function LanguageCard({
  skill,
  className,
}: Readonly<SkillCardProps>) {
  return (
    <div
      className={cn(
        "gap-4 p-4  border transition-colors duration-300 flex items-center justify-center bg-background px-4 py-8 md:p-8 hover:bg-white/8  group select-none cursor-pointer",
        className,
      )}
    >
      <div className="shrink-0 transition-transform duration-500 group-hover:scale-110">
        {skill.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors truncate">
          {skill.label}
        </p>
      </div>
    </div>
  );
}
