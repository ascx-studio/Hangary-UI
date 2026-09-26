import Socialicons from "./socialicons";
import LanguageCard from "../components/cards/language-card";
import { language } from "../lib/skills-data";
import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className=" w-full mx-auto overflow-hidden shadow-2xl relative border border-border backdrop-blur-sm rounded-base">
      <div className="px-6 md:px-10 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] border-b border-border">
          <div className="p-2  flex items-center justify-center border-b md:border-b-0 md:border-r ">
              <Image
                src="https://avatars.githubusercontent.com/u/154011772?v=4"
                alt="Rajeev Puri's Avatar"
                width={160}
                height={160}
                className="size-60 object-cover"
                priority
              />
          </div>

          <div className="flex flex-col justify-between ">

            <h2 className="text-6xl md:text-8xl font-bold px-8 py-4 text-white tracking-tight">
              Rajeev Puri
            </h2>


            <p className="text-lg px-8 py-5 text-zinc-400 font-medium mt-1 border-t border-border ">
              Currently Bsc Student at University of Wolverhampton
            </p>
          </div>
        </div>

        <p className="text-md text-zinc-400 leading-relaxed font-light  border-l-2  border-border pl-4 py-1 mt-5">
          &quot;Life folds into two phases, Second one starts once we realize we got
          only one.&quot; — Confucius
        </p>

        <div className="w-full h-px bg-linear-to-r from-white/5 via-white/10 to-white/5 my-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex gap-6 text-zinc-500">
            <Socialicons showLabel />
          </div>
        </div>
      </div>

      <div className="relative border-t border-border overflow-hidden  grid md:grid-cols-3 grid-cols-2 w-full ">
        {language.map((item, idx) => (
          <LanguageCard
            key={`${item.label}-${idx}`}
            skill={item}
            className="border-r border-b border-border"
          />
        ))}
      </div>

      <div className="absolute top-10 right-10 text-white/2 text-9xl font-black italic pointer-events-none uppercase select-none leading-none z-0">
        RAJEEV
      </div>
    </div>
  );
}
