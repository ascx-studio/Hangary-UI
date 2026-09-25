import React from "react";

type LocationCardProps = {
  label: string;
  title: string;
  subtitle?: string;
  address: string[];
  status?: string;
  time?: string;
  statusDotClass?: string;
};

export default function LocationCard({
  label,
  title,
  subtitle,
  address,
  status,
  time,
  statusDotClass = "bg-emerald-500",
}: LocationCardProps) {
  return (
    <div className="p-8 md:p-10 space-y-6 border border-zinc-800  cursor-pointer  hover:border-primary ">
      <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.25em] block">
        {label}
      </span>

      <div>
        <h3 className="text-white text-4xl font-semibold tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-zinc-500 text-xs mt-1 font-sans">{subtitle}</p>
        )}
      </div>




      {status && (
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest pt-2">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${statusDotClass}`}
          />
          <span>{time ? `${status} (${time})` : status}</span>
        </div>
      )}
    </div>
  );
}
